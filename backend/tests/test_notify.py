"""E-mail notifications. A fake SMTP class replaces smtplib, so nothing real is ever sent."""
import smtplib
import ssl

import pytest
from fastapi.testclient import TestClient

from app import cli, notify
from app.config import Settings
from app.db import Enquiry, make_session_factory
from app.main import create_app

VALID = {
    "kind": "demo", "name": "Asha Rao", "email": "asha@acme-builders.com", "company": "Acme Builders", "interest": "anviksha",
    "message": "We want to see Anviksha on our tower inspections next quarter.", "budget": "", "timeline": "1-3m",
    "consent": True, "website": "", "form_elapsed_ms": 12_000,
}


class FakeSMTP:
    """Records what would have been sent. `plan` lists one outcome per connection attempt: None = success, or an exception."""

    sent: list = []
    plan: list = []
    calls: list = []

    def __init__(self, host, port, timeout=None, context=None):
        self.host, self.port, self.context = host, port, context
        FakeSMTP.calls.append({"host": host, "port": port, "ssl": isinstance(self, FakeSMTPSSL)})
        self.session = {"starttls": None, "login": None}

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def ehlo(self):
        pass

    def starttls(self, context=None):
        self.session["starttls"] = context

    def login(self, user, password):
        self.session["login"] = (user, password)

    def send_message(self, msg):
        outcome = FakeSMTP.plan.pop(0) if FakeSMTP.plan else None
        if outcome is not None:
            raise outcome
        FakeSMTP.sent.append((msg, self.session))


class FakeSMTPSSL(FakeSMTP):
    pass


@pytest.fixture(autouse=True)
def fake_smtp(monkeypatch):
    FakeSMTP.sent, FakeSMTP.plan, FakeSMTP.calls = [], [], []
    monkeypatch.setattr(notify.smtplib, "SMTP", FakeSMTP)
    monkeypatch.setattr(notify.smtplib, "SMTP_SSL", FakeSMTPSSL)
    monkeypatch.setattr(notify.time, "sleep", lambda _s: None)


def settings(tmp_path, **over):
    base = dict(
        app_env="test", database_url=f"sqlite:///{tmp_path / 'n.db'}", smtp_host="email-smtp.ap-south-1.amazonaws.com", smtp_port=587,
        smtp_username="AKIAEXAMPLE", smtp_password="not-a-real-secret", notify_to="mhcai@myhomeconstructions.com", _env_file=None,
    )
    base.update(over)
    return Settings(**base)


def submit(s, **over):
    with TestClient(create_app(s)) as c:
        r = c.post("/api/enquiries", json={**VALID, **over})
        assert r.status_code == 201, r.text
        ref = r.json()["id"]
        with c.app.state.session_factory() as db:
            row = db.get(Enquiry, ref)
            return ref, row.notified, row.notify_error


def test_enquiry_is_emailed_to_the_configured_address(tmp_path):
    ref, notified, error = submit(settings(tmp_path))
    assert notified is True and error is None
    msg, session = FakeSMTP.sent[0]
    assert msg["To"] == "mhcai@myhomeconstructions.com"
    assert msg["From"] == "SiteSureLabs <noreply@sitesurelabs.com>"  # SES-verified domain, not the SMTP username
    assert msg["Reply-To"] == "asha@acme-builders.com"  # replying answers the visitor
    assert ref in msg["Subject"] and "Asha Rao" in msg["Subject"] and "Acme Builders" in msg["Subject"]
    assert msg["X-Enquiry-ID"] == ref
    body = msg.get_content()
    assert "We want to see Anviksha" in body and "anviksha" in body and "asha@acme-builders.com" in body
    assert session["login"] == ("AKIAEXAMPLE", "not-a-real-secret")


def test_starttls_verifies_the_server_certificate(tmp_path):
    submit(settings(tmp_path))
    ctx = FakeSMTP.sent[0][1]["starttls"]
    assert isinstance(ctx, ssl.SSLContext) and ctx.verify_mode == ssl.CERT_REQUIRED and ctx.check_hostname is True


def test_port_465_uses_implicit_tls(tmp_path):
    submit(settings(tmp_path, smtp_port=465))
    assert FakeSMTP.calls[0]["ssl"] is True
    assert FakeSMTP.sent[0][1]["starttls"] is None


def test_several_recipients_are_accepted(tmp_path):
    submit(settings(tmp_path, notify_to="a@example.com; b@example.com  c@example.com"))
    assert FakeSMTP.sent[0][0]["To"] == "a@example.com, b@example.com, c@example.com"


def test_line_breaks_in_a_name_cannot_break_or_inject_headers(tmp_path):
    ref, notified, error = submit(settings(tmp_path), name="Asha\r\nBcc: attacker@example.com")
    assert notified is True and error is None
    msg = FakeSMTP.sent[0][0]
    assert "\n" not in msg["Subject"] and "\r" not in msg["Subject"]
    assert msg["Bcc"] is None


def test_non_production_subject_is_tagged_and_production_is_not(tmp_path):
    submit(settings(tmp_path, app_env="development"))
    assert FakeSMTP.sent[0][0]["Subject"].startswith("[development] ")
    FakeSMTP.sent.clear()
    submit(settings(tmp_path, app_env="production", ip_hash_salt="x" * 24), message="A different enquiry, so the duplicate guard does not skip it.")
    assert FakeSMTP.sent[0][0]["Subject"].startswith("[SiteSureLabs]")


def test_temporary_failures_are_retried_then_succeed(tmp_path):
    FakeSMTP.plan = [smtplib.SMTPServerDisconnected("x"), smtplib.SMTPResponseException(421, b"busy"), None]
    _ref, notified, error = submit(settings(tmp_path))
    assert notified is True and error is None and len(FakeSMTP.sent) == 1 and len(FakeSMTP.calls) == 3


def test_bad_credentials_are_not_retried_and_are_recorded_without_secrets(tmp_path):
    FakeSMTP.plan = [smtplib.SMTPAuthenticationError(535, b"Authentication Credentials Invalid secret-text")]
    _ref, notified, error = submit(settings(tmp_path))
    assert notified is False and error == "email: SMTPAuthenticationError(535)"
    assert len(FakeSMTP.calls) == 1  # retrying a wrong password would only get the account throttled
    assert "secret-text" not in error and "not-a-real-secret" not in error


def test_gives_up_after_three_temporary_failures(tmp_path):
    FakeSMTP.plan = [OSError("net down")] * 3
    _ref, notified, error = submit(settings(tmp_path))
    assert notified is False and error == "email: OSError" and len(FakeSMTP.calls) == 3


def test_enquiry_is_kept_when_email_fails(tmp_path):
    FakeSMTP.plan = [smtplib.SMTPSenderRefused(554, b"not verified", "x@y.z")]
    s = settings(tmp_path)
    ref, notified, _ = submit(s)
    factory = make_session_factory(s.database_url)
    with factory() as db:
        assert db.get(Enquiry, ref) is not None and notified is False


def test_not_configured_stores_only(tmp_path):
    ref, notified, error = submit(settings(tmp_path, smtp_host=None, notify_to=None))
    assert notified is False and error is None and FakeSMTP.calls == []


def test_config_problems_are_reported_without_secrets(tmp_path):
    assert notify.config_problems(settings(tmp_path)) == []
    assert any("no notification channel" in p for p in notify.config_problems(settings(tmp_path, smtp_host=None, notify_to=None)))
    assert any("NOTIFY_TO" in p for p in notify.config_problems(settings(tmp_path, notify_to=None)))
    assert any("together" in p for p in notify.config_problems(settings(tmp_path, smtp_password=None)))
    assert "not-a-real-secret" not in " ".join(notify.config_problems(settings(tmp_path, notify_to=None)))


def test_health_reports_whether_notifications_are_configured(tmp_path):
    with TestClient(create_app(settings(tmp_path))) as c:
        assert c.get("/api/health").json()["notifications"] is True
    with TestClient(create_app(settings(tmp_path, smtp_host=None))) as c:
        assert c.get("/api/health").json()["notifications"] is False


def test_cli_resend_pending_sends_only_undelivered_enquiries(tmp_path, monkeypatch, capsys):
    s = settings(tmp_path, smtp_host=None, notify_to=None)  # stored while notifications were off
    ref, notified, _ = submit(s)
    assert notified is False
    live = settings(tmp_path)
    monkeypatch.setattr(cli, "get_settings", lambda: live)
    assert cli.main(["resend-pending", "--dry-run"]) == 0
    assert FakeSMTP.sent == [] and ref in capsys.readouterr().out
    assert cli.main(["resend-pending"]) == 0
    assert len(FakeSMTP.sent) == 1 and FakeSMTP.sent[0][0]["X-Enquiry-ID"] == ref
    factory = make_session_factory(live.database_url)
    with factory() as db:
        assert db.get(Enquiry, ref).notified is True
    assert cli.main(["resend-pending"]) == 0 and len(FakeSMTP.sent) == 1  # nothing left: no duplicate e-mail


def test_cli_send_test_reports_success_and_failure(tmp_path, monkeypatch, capsys):
    live = settings(tmp_path)
    monkeypatch.setattr(cli, "get_settings", lambda: live)
    assert cli.main(["send-test"]) == 0 and FakeSMTP.sent[0][0]["To"] == "mhcai@myhomeconstructions.com"
    FakeSMTP.plan = [smtplib.SMTPAuthenticationError(535, b"no")]
    assert cli.main(["send-test"]) == 1
    out = capsys.readouterr().out
    assert "FAILED: SMTPAuthenticationError(535)" in out and "not-a-real-secret" not in out


def test_cli_status_never_prints_the_password(tmp_path, monkeypatch, capsys):
    monkeypatch.setattr(cli, "get_settings", lambda: settings(tmp_path))
    assert cli.main(["status"]) == 0
    out = capsys.readouterr().out
    assert "credentials : set" in out and "not-a-real-secret" not in out and "AKIAEXAMPLE" not in out
