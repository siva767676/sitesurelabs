import pytest
from fastapi.testclient import TestClient

from app.config import Settings
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


@pytest.mark.parametrize("interest", ["anviksha", "sitevision", "digi-reco", "parichay", "progress-tracker", "custom-ai", "other"])
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
