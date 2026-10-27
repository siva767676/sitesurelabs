from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlalchemy import func, select, text

from app.config import Settings
from app.db import Enquiry, make_session_factory
from app.main import create_app

VALID = {
    "kind": "demo",
    "name": "Asha Rao",
    "email": "asha@acme-builders.com",
    "company": "Acme Builders",
    "interest": "anviksha",
    "message": "We want to see Anviksha on our tower inspections next quarter.",
    "budget": "",
    "timeline": "1-3m",
    "consent": True,
    "website": "",
    "form_elapsed_ms": 12_000,
}


@pytest.fixture
def client(tmp_path):
    settings = Settings(
        app_env="test", database_url=f"sqlite:///{tmp_path / 'test.db'}", admin_token="secret-token", rate_limit_max=3,
        cors_origins="http://localhost:5173", _env_file=None,
    )
    with TestClient(create_app(settings)) as c:
        yield c


def post(client, **over):
    return client.post("/api/enquiries", json={**VALID, **over})


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json()["database"] is True


def test_valid_enquiry_is_stored_and_listed(client):
    r = post(client)
    assert r.status_code == 201
    body = r.json()
    assert body["status"] == "received" and body["id"].startswith("SSL-")

    listed = client.get("/api/admin/enquiries", headers={"Authorization": "Bearer secret-token"})
    assert listed.status_code == 200
    rows = listed.json()
    assert len(rows) == 1 and rows[0]["email"] == "asha@acme-builders.com" and rows[0]["id"] == body["id"]
    assert "ip_hash" not in rows[0]


@pytest.mark.parametrize("interest", ["anviksha", "sitevision", "digi-reco", "parichay", "progress-tracker", "robotic-dog", "custom-ai", "other"])
def test_every_product_can_be_the_interest(client, interest):
    r = post(client, interest=interest, message=f"We would like to talk about {interest} for our sites.")
    assert r.status_code == 201
    rows = client.get("/api/admin/enquiries", headers={"Authorization": "Bearer secret-token"}).json()
    assert rows[0]["interest"] == interest


def test_duplicate_submission_is_idempotent(client):
    a, b = post(client), post(client)
    assert a.status_code == b.status_code == 201 and a.json()["id"] == b.json()["id"]
    rows = client.get("/api/admin/enquiries", headers={"Authorization": "Bearer secret-token"}).json()
    assert len(rows) == 1


def test_validation_errors_are_per_field(client):
    r = post(client, name="A", message="too short", email="not-an-email")
    assert r.status_code == 422
    err = r.json()["error"]
    assert err["code"] == "validation_error"
    assert {"name", "message", "email"} <= set(err["fields"])


def test_consent_required(client):
    assert post(client, consent=False).status_code == 422


def test_free_email_rejected(client):
    r = post(client, email="someone@gmail.com")
    assert r.status_code == 422 and r.json()["error"]["fields"]["email"]


def test_honeypot_rejected_and_not_stored(client):
    r = post(client, website="http://spam.example")
    assert r.status_code == 400 and r.json()["error"]["code"] == "spam_detected"
    assert client.get("/api/admin/enquiries", headers={"Authorization": "Bearer secret-token"}).json() == []


def test_too_fast_rejected(client):
    r = post(client, form_elapsed_ms=300)
    assert r.status_code == 400 and r.json()["error"]["code"] == "spam_detected"


def test_too_many_links_rejected(client):
    r = post(client, message="see http://a.com http://b.com http://c.com http://d.com for details please")
    assert r.status_code == 422 and "message" in r.json()["error"]["fields"]


def test_rate_limit(client):
    for i in range(3):
        assert post(client, message=f"Distinct enquiry number {i} about site inspections.").status_code == 201
    r = post(client, message="One more distinct enquiry about a different topic.")
    assert r.status_code == 429
    assert r.json()["error"]["code"] == "rate_limited" and int(r.headers["Retry-After"]) > 0


def test_unknown_fields_rejected(client):
    assert post(client, is_admin=True).status_code == 422


def test_admin_requires_token(client):
    assert client.get("/api/admin/enquiries").status_code == 401
    assert client.get("/api/admin/enquiries", headers={"Authorization": "Bearer wrong"}).status_code == 401


def test_admin_disabled_without_token(tmp_path):
    s = Settings(app_env="test", database_url=f"sqlite:///{tmp_path / 'x.db'}", _env_file=None)
    with TestClient(create_app(s)) as c:
        assert c.get("/api/admin/enquiries", headers={"Authorization": "Bearer anything"}).status_code == 404


def test_not_found_uses_error_shape(client):
    r = client.get("/api/nope")
    assert r.status_code == 404 and r.json()["error"]["code"] == "not_found"


def test_cors_preflight(client):
    r = client.options("/api/enquiries", headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type"})
    assert r.status_code == 200 and r.headers["access-control-allow-origin"] == "http://localhost:5173"
    bad = client.options("/api/enquiries", headers={"Origin": "http://evil.example", "Access-Control-Request-Method": "POST"})
    assert "access-control-allow-origin" not in bad.headers


# ---------------------------------------------------------------- SQLite


def test_timestamps_come_back_in_utc(client):
    post(client)
    created = client.get("/api/admin/enquiries", headers={"Authorization": "Bearer secret-token"}).json()[0]["created_at"]
    assert datetime.fromisoformat(created).utcoffset() == timedelta(0)


def test_duplicates_only_count_within_24_hours(client):
    first = post(client).json()["id"]
    with client.app.state.session_factory() as db:  # age the stored enquiry past the window
        db.get(Enquiry, first).created_at = datetime.now(timezone.utc) - timedelta(hours=25)
        db.commit()
    assert post(client).json()["id"] != first


def test_database_file_and_folder_are_created_in_wal_mode(tmp_path):
    path = tmp_path / "new" / "folder" / "enquiries.db"
    settings = Settings(app_env="test", database_url=f"sqlite:///{path}", _env_file=None)
    with TestClient(create_app(settings)) as c:
        assert c.get("/api/health").json()["database"] is True
        with c.app.state.session_factory() as db:
            assert db.execute(text("PRAGMA journal_mode")).scalar() == "wal"
    assert path.is_file()


def test_concurrent_writers_do_not_lock_each_other_out(tmp_path):
    factory = make_session_factory(f"sqlite:///{tmp_path / 'busy.db'}")

    def write(i: int) -> None:
        with factory() as db:
            db.add(Enquiry(id=f"SSL-{i:08X}", kind="demo", name="N", email="n@acme.example", company="Acme", interest="other", message="m", content_hash=str(i), ip_hash="h"))
            db.commit()

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(write, range(48)))
    with factory() as db:
        assert db.scalar(select(func.count()).select_from(Enquiry)) == 48


def test_notification_outcome_is_saved_on_the_enquiry(tmp_path):
    # httpx refuses an ftp:// webhook at once, so delivery fails; the background task records that on the stored row
    settings = Settings(app_env="test", database_url=f"sqlite:///{tmp_path / 'n.db'}", webhook_url="ftp://127.0.0.1/hook", _env_file=None)
    with TestClient(create_app(settings)) as c:
        ref = post(c).json()["id"]
        with c.app.state.session_factory() as db:
            row = db.get(Enquiry, ref)
            assert row is not None and row.notified is False and (row.notify_error or "").startswith("webhook:")


def test_in_memory_database():
    settings = Settings(app_env="test", database_url="sqlite://", admin_token="t", _env_file=None)
    with TestClient(create_app(settings)) as c:
        assert post(c).status_code == 201
        assert len(c.get("/api/admin/enquiries", headers={"Authorization": "Bearer t"}).json()) == 1


@pytest.mark.parametrize("url", ["postgresql+psycopg://user:pass@localhost:5432/sitesurelabs", "mysql://user:pass@localhost/sitesurelabs"])
def test_only_sqlite_is_accepted(url):
    with pytest.raises(ValidationError, match="SQLite"):
        Settings(database_url=url, _env_file=None)
