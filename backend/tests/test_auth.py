import pytest
from httpx import AsyncClient
from jose import jwt

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password


def test_password_hashing():
    raw_password = "SecretPassword123"
    hashed = get_password_hash(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_creation():
    subject = "user-uuid-1234"
    token = create_access_token(subject=subject)
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == subject
    assert "exp" in payload


@pytest.mark.asyncio
async def test_register_user_flow(client: AsyncClient):
    payload = {
        "email": "breyner@draftly.app",
        "password": "Password123!",
        "full_name": "Breyner Manga",
        "default_currency": "COP",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "breyner@draftly.app"
    assert data["full_name"] == "Breyner Manga"
    assert data["default_currency"] == "COP"
    assert "id" in data
    assert "webhook_token" in data
    assert len(data["webhook_token"]) > 10


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {
        "email": "daniel@draftly.app",
        "password": "Password123!",
        "full_name": "Daniel Dev",
        "default_currency": "COP",
    }
    res1 = await client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    # Second attempt with same email
    res2 = await client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "Ya existe un usuario" in res2.json()["detail"]


@pytest.mark.asyncio
async def test_login_and_get_me_flow(client: AsyncClient):
    # 1. Register
    reg_payload = {
        "email": "login_test@draftly.app",
        "password": "SecurePassword999",
        "full_name": "Test User",
        "default_currency": "COP",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # 2. Login
    login_payload = {
        "email": "login_test@draftly.app",
        "password": "SecurePassword999",
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["user"]["email"] == "login_test@draftly.app"

    token = token_data["access_token"]

    # 3. Access /auth/me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = await client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "login_test@draftly.app"
    assert "webhook_token" in me_data


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient):
    reg_payload = {
        "email": "invalid_pwd@draftly.app",
        "password": "CorrectPassword123",
        "full_name": "User",
        "default_currency": "COP",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_payload = {
        "email": "invalid_pwd@draftly.app",
        "password": "WrongPassword999",
    }
    res = await client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 401
