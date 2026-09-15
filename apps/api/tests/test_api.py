from fastapi.testclient import TestClient
from apps.api.app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Decision-support" in data["notice"]


def test_system_health():
    response = client.get("/api/v1/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "analyst@suraksha.ai",
        "password": "Suraksha@2026"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "HSE_ANALYST"


def test_list_reports():
    response = client.get("/api/v1/reports")
    assert response.status_code == 200
    reports = response.json()
    assert isinstance(reports, list)
    assert len(reports) >= 1
    assert reports[0]["report_uid"] == "REP-2026-001"


def test_barriers_and_rules():
    res_b = client.get("/api/v1/barriers")
    assert res_b.status_code == 200
    assert len(res_b.json()) >= 8

    res_r = client.get("/api/v1/life-saving-rules")
    assert res_r.status_code == 200
    assert len(res_r.json()) == 9
