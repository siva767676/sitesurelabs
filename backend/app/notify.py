"""Enquiry notifications: e-mail (any SMTP server, e.g. Amazon SES) and an optional webhook.

An enquiry is always stored first. Delivery runs afterwards as a background task and its outcome is saved on the
stored row (`notified`, `notify_error`), so a failed e-mail never loses an enquiry and can be re-sent with
`python -m app.cli resend-pending`.
"""
import logging
import re
import smtplib
import ssl
import time
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

import httpx
from sqlalchemy.orm import Session, sessionmaker

from .config import Settings
from .db import Enquiry

log = logging.getLogger("app.notify")

# Sender used when NOTIFY_FROM is not set. sitesurelabs.com is a verified Amazon SES identity, so any address at that
# domain may send. (The SMTP username must not be used: for SES it is an access key id, not an e-mail address.)
DEFAULT_FROM = "SiteSureLabs <noreply@sitesurelabs.com>"

# Seconds to wait between attempts. Three attempts in total; only temporary failures are retried.
RETRY_DELAYS: tuple[float, ...] = (2.0, 8.0)

_WS = re.compile(r"[\s\x00-\x1f\x7f]+")


def recipients(s: Settings) -> list[str]:
    """NOTIFY_TO may hold several addresses separated by commas, semicolons or spaces."""
    parts = re.split(r"[,;\s]+", s.notify_to or "")
    return [p for p in parts if "@" in p]


def notifications_configured(s: Settings) -> bool:
    return bool((s.smtp_host and recipients(s)) or s.webhook_url)


def config_problems(s: Settings) -> list[str]:
    """Human-readable problems with the notification settings. Never includes a secret value."""
    problems: list[str] = []
    if not notifications_configured(s):
        problems.append("no notification channel is configured: enquiries are stored but nobody is told (set NOTIFY_TO and SMTP_HOST)")
    if s.smtp_host and not recipients(s):
        problems.append("SMTP_HOST is set but NOTIFY_TO has no valid address")
    if recipients(s) and not s.smtp_host:
        problems.append("NOTIFY_TO is set but SMTP_HOST is empty, so no e-mail will be sent")
    if bool(s.smtp_username) != bool(s.smtp_password):
        problems.append("SMTP_USERNAME and SMTP_PASSWORD must be set together")
    return problems


def _oneline(text: str, limit: int = 100) -> str:
    """One line of plain text, safe for an e-mail header: no line breaks or control characters."""
    return _WS.sub(" ", text).strip()[:limit]


def _body(e: Enquiry) -> str:
    return (
        f"New {e.kind} enquiry  [{e.id}]\n\n"
        f"Name:     {e.name}\nEmail:    {e.email}\nCompany:  {e.company}\n"
        f"Interest: {e.interest}\nBudget:   {e.budget or '-'}\nTimeline: {e.timeline or '-'}\n"
        f"Received: {e.created_at.isoformat()}\n\n"
        f"{e.message}\n\n"
        f"--\nSent by the SiteSureLabs website. Reply to this message to answer {_oneline(e.name, 60)} directly.\n"
    )


def build_message(e: Enquiry, s: Settings) -> EmailMessage:
    env_tag = "" if s.is_production else f"[{s.app_env}] "  # a test e-mail is never mistaken for a real enquiry
    msg = EmailMessage()
    msg["Subject"] = f"{env_tag}[SiteSureLabs] {_oneline(e.kind, 16)} enquiry from {_oneline(e.name, 60)} ({_oneline(e.company, 60)}) [{_oneline(e.id, 24)}]"
    msg["From"] = s.notify_from or DEFAULT_FROM
    msg["To"] = ", ".join(recipients(s))
    msg["Reply-To"] = _oneline(e.email, 254)
    msg["Date"] = formatdate(localtime=False)
    msg["Message-ID"] = make_msgid(domain="sitesurelabs.com")
    msg["X-Enquiry-ID"] = _oneline(e.id, 24)
    msg.set_content(_body(e))
    return msg


def build_test_message(s: Settings, to: list[str] | None = None) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"[SiteSureLabs] test e-mail from the website ({s.app_env})"
    msg["From"] = s.notify_from or DEFAULT_FROM
    msg["To"] = ", ".join(to or recipients(s))
    msg["Date"] = formatdate(localtime=False)
    msg["Message-ID"] = make_msgid(domain="sitesurelabs.com")
    msg.set_content(
        "This is a test message from the SiteSureLabs website API.\n\n"
        f"Environment: {s.app_env}\nSMTP server: {s.smtp_host}:{s.smtp_port}\n\n"
        "If you received it, enquiry notifications are working. No enquiry was involved.\n"
    )
    return msg


def _smtp_once(msg: EmailMessage, s: Settings) -> None:
    """One delivery attempt. Port 465 uses implicit TLS; other ports upgrade with STARTTLS (certificate checked)."""
    context = ssl.create_default_context()
    if s.smtp_port == 465:
        smtp = smtplib.SMTP_SSL(s.smtp_host, s.smtp_port, timeout=15, context=context)
    else:
        smtp = smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=15)
    with smtp:
        smtp.ehlo()
        if s.smtp_port != 465 and s.smtp_starttls:
            smtp.starttls(context=context)
            smtp.ehlo()
        if s.smtp_username and s.smtp_password:
            smtp.login(s.smtp_username, s.smtp_password)
        smtp.send_message(msg)


def _is_temporary(exc: Exception) -> bool:
    """Network trouble and 4xx replies are worth retrying; authentication and 5xx rejections are not."""
    if isinstance(exc, smtplib.SMTPAuthenticationError):
        return False
    if isinstance(exc, smtplib.SMTPResponseException):
        return 400 <= exc.smtp_code < 500
    if isinstance(exc, (smtplib.SMTPRecipientsRefused, smtplib.SMTPSenderRefused, smtplib.SMTPDataError)):
        return False
    return isinstance(exc, (smtplib.SMTPException, OSError, TimeoutError))  # disconnects, DNS, timeouts


def describe(exc: Exception) -> str:
    """The error class (and SMTP reply code) only. The message text can carry addresses or server details."""
    code = getattr(exc, "smtp_code", None)
    return f"{exc.__class__.__name__}({code})" if code else exc.__class__.__name__


def send_with_retry(msg: EmailMessage, s: Settings) -> None:
    last: Exception | None = None
    for attempt in range(len(RETRY_DELAYS) + 1):
        try:
            _smtp_once(msg, s)
            return
        except Exception as exc:  # noqa: BLE001
            last = exc
            if attempt == len(RETRY_DELAYS) or not _is_temporary(exc):
                break
            log.warning("e-mail attempt failed, retrying", extra={"ctx": {"attempt": attempt + 1, "error": describe(exc)}})
            time.sleep(RETRY_DELAYS[attempt])
    assert last is not None
    raise last


def _send_webhook(e: Enquiry, s: Settings) -> None:
    payload = {
        "id": e.id, "created_at": e.created_at.isoformat(), "kind": e.kind, "name": e.name, "email": e.email, "company": e.company,
        "interest": e.interest, "budget": e.budget, "timeline": e.timeline, "message": e.message,
    }
    httpx.post(s.webhook_url, json=payload, timeout=10.0).raise_for_status()


def deliver(e: Enquiry, s: Settings) -> list[str]:
    """Send every configured notification for one enquiry. Returns the errors (empty list = all delivered)."""
    errors: list[str] = []
    if s.smtp_host and recipients(s):
        try:
            send_with_retry(build_message(e, s), s)
        except Exception as exc:  # noqa: BLE001 - recorded, never raised into the request
            errors.append(f"email: {describe(exc)}")
            log.error("email notification failed", extra={"ctx": {"enquiry": e.id, "error": describe(exc)}})
    if s.webhook_url:
        try:
            _send_webhook(e, s)
        except Exception as exc:  # noqa: BLE001
            errors.append(f"webhook: {exc.__class__.__name__}")
            log.error("webhook notification failed", extra={"ctx": {"enquiry": e.id, "error": exc.__class__.__name__}})
    return errors


def dispatch(enquiry_id: str, settings: Settings, factory: sessionmaker[Session]) -> None:
    """Background task: deliver notifications, then record the outcome on the stored enquiry."""
    with factory() as db:
        e = db.get(Enquiry, enquiry_id)
        if e is None:
            return
        if not notifications_configured(settings):
            log.warning("notifications not configured; enquiry stored only", extra={"ctx": {"enquiry": enquiry_id}})
            return
        errors = deliver(e, settings)
        e.notified = not errors
        e.notify_error = "; ".join(errors) or None
        db.commit()
        if not errors:
            log.info("enquiry notified", extra={"ctx": {"enquiry": enquiry_id}})
