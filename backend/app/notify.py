import logging
import smtplib
from email.message import EmailMessage

import httpx
from sqlalchemy.orm import Session, sessionmaker

from .config import Settings
from .db import Enquiry

log = logging.getLogger("app.notify")


def _body(e: Enquiry) -> str:
    return (
        f"New {e.kind} enquiry  [{e.id}]\n\n"
        f"Name:     {e.name}\nEmail:    {e.email}\nCompany:  {e.company}\n"
        f"Interest: {e.interest}\nBudget:   {e.budget or '-'}\nTimeline: {e.timeline or '-'}\n\n"
        f"{e.message}\n"
    )


def _send_email(e: Enquiry, s: Settings) -> None:
    msg = EmailMessage()
    msg["Subject"] = f"[SiteSureLabs] {e.kind} enquiry from {e.name} ({e.company})"
    msg["From"] = s.notify_from or s.smtp_username or "no-reply@localhost"
    msg["To"] = s.notify_to
    msg["Reply-To"] = e.email
    msg.set_content(_body(e))
    with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=15) as smtp:
        if s.smtp_starttls:
            smtp.starttls()
        if s.smtp_username and s.smtp_password:
            smtp.login(s.smtp_username, s.smtp_password)
        smtp.send_message(msg)


def _send_webhook(e: Enquiry, s: Settings) -> None:
    payload = {
        "id": e.id, "created_at": e.created_at.isoformat(), "kind": e.kind, "name": e.name, "email": e.email, "company": e.company,
        "interest": e.interest, "budget": e.budget, "timeline": e.timeline, "message": e.message,
    }
    httpx.post(s.webhook_url, json=payload, timeout=10.0).raise_for_status()


def notifications_configured(s: Settings) -> bool:
    return bool((s.smtp_host and s.notify_to) or s.webhook_url)


def dispatch(enquiry_id: str, settings: Settings, factory: sessionmaker[Session]) -> None:
    """Background task: deliver notifications, then record the outcome on the stored enquiry."""
    errors: list[str] = []
    with factory() as db:
        e = db.get(Enquiry, enquiry_id)
        if e is None:
            return
        if not notifications_configured(settings):
            log.info("notifications not configured; enquiry stored only", extra={"ctx": {"enquiry": enquiry_id}})
            return
        if settings.smtp_host and settings.notify_to:
            try:
                _send_email(e, settings)
            except Exception as exc:  # noqa: BLE001 - recorded, never raised into the request
                errors.append(f"email: {exc.__class__.__name__}")
                log.exception("email notification failed", extra={"ctx": {"enquiry": enquiry_id}})
        if settings.webhook_url:
            try:
                _send_webhook(e, settings)
            except Exception as exc:  # noqa: BLE001
                errors.append(f"webhook: {exc.__class__.__name__}")
                log.exception("webhook notification failed", extra={"ctx": {"enquiry": enquiry_id}})
        e.notified = not errors
        e.notify_error = "; ".join(errors) or None
        db.commit()
