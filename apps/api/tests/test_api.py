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


import time

def test_login():
    test_email = f"test_{int(time.time() * 1000)}@suraksha.ai"
    reg_response = client.post("/api/v1/auth/register", json={
        "full_name": "Test Safety Analyst",
        "email": test_email,
        "password": "SurakshaSecure@2026",
        "role": "HSE_ANALYST"
    })
    assert reg_response.status_code == 200
    reg_data = reg_response.json()
    assert "access_token" in reg_data

    response = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "SurakshaSecure@2026"
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
    assert "report_uid" in reports[0]


def test_barriers_and_rules():
    res_b = client.get("/api/v1/barriers")
    assert res_b.status_code == 200
    assert len(res_b.json()) >= 8

    res_r = client.get("/api/v1/life-saving-rules")
    assert res_r.status_code == 200
    assert len(res_r.json()) == 9
