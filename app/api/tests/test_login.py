import pytest
from fastapi.testclient import TestClient

from api.models.user import create_user
from api.main.database import SessionLocal


@pytest.mark.needs(postgres=True)
def test_valid_login(client: TestClient) -> None:
    """
    Test that a created user is able to login successfully
    """
    db = SessionLocal()
    user = create_user(db, email="test@gmail.com", password="Testing-123")
    db.close()
    assert user, "User not created before trying to sign in a valid user."

    resp = client.post(
        "/api/login", json={"email": "test@gmail.com", "password": "Testing-123", "user_group": "medical"}
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 200
    ), "Error while signing in test user with valid credentials" + str(resp_data)
    assert (
        "access_token" in resp_data
    ), "Access token was not provided after signing in a valid user"


@pytest.mark.needs(postgres=True)
def test_invalid_email(client: TestClient) -> None:
    """ "
    Test that a user with an invalid email is unable to sign in.
    """
    resp = client.post(
        "/api/login", json={"email": "hackerman", "password": "Testing-123"}
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 422
    ), "Email validation error should have been returned, instead got:\n" + str(
        resp_data
    )
    assert (
        "detail" in resp_data
    ), "Error data should have been returned in response, instead got:\n" + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_invalid_password(client: TestClient) -> None:
    """
    Test that a user with an invalid password is unable to sign in.
    """
    resp = client.post(
        "/api/login", json={"email": "test@gmail.com", "password": "Testing123"}
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 422
    ), "Password validation error should have been returned, instead got:\n" + str(
        resp_data
    )
    assert (
        "detail" in resp_data
    ), "Error data should have been returned in response, instead got:\n" + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_user_not_found(client: TestClient) -> None:
    """
    Test that a user that does not exist is not found.
    """
    resp = client.post(
        "/api/login", json={"email": "doesntexist@gmail.com", "password": "Testing-123", "user_group": "medical"}
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 401
    ), "User should not have been found, instead got:\n" + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_no_user_group(client: TestClient) -> None:
    """
    Test that a sign in attempt without a user group fails gracefully
    """
    resp = client.post(
        "/api/login", json={"email": "doesntexist@gmail.com", "password": "Testing-123"}
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 401
    ), "Invalid user group error should have been returned, instead got:\n" + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_invalid_user_group(client: TestClient) -> None:
    """
    Test that a sign in attempt with an invalid user group fails gracefully
    """
    resp = client.post(
        "/api/login", json={"email": "doesntexist@gmail.com", "password": "Testing-123", "user_group": "invalidUserGroup"}
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 401
    ), "Invalid user group error should have been returned, instead got:\n" + str(resp_data)
