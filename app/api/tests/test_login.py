import pytest
from fastapi.testclient import TestClient

from api.models.user import create_user
from api.database import get_db

@pytest.mark.needs(postgres=True)
def test_valid_login(client: TestClient) -> None:
    """
    Test that a created user is able to login successfully
    """
    user = create_user(get_db(), email="test@gmail.com", password="Testing123")
    assert user, "User not created before trying to sign in a valid user."

    resp = client.post("/login")
    resp_data = resp.json()
    assert resp.status_code == "200", (
        "Error while signing in test user with valid credentials" + str(resp_data)
    )
    assert "access_token" in resp_data, "Access token was not provided after signing in a valid user"


@pytest.mark.needs(postgres=True)
def test_invalid_email(client: TestClient) -> None:
    """"
    Test that a user with an invalid email is unable to sign in.
    """
    pass


@pytest.mark.needs(postgres=True)
def test_invalid_password(client: TestClient) -> None:
    """
    Test that a user with an invalid password is unable to sign in.
    """
    pass


@pytest.mark.needs(postgres=True)
def test_user_not_found(client: TestClient) -> None:
    """
    Test that a user that does not exist is not found.
    """
    pass