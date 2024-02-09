import pytest
from fastapi.testclient import TestClient

from api.constants import MEDICAL
from api.models.user import create_user
from api.main.database import db_functions


@pytest.mark.needs(postgres=True)
def test_valid_register(client: TestClient) -> None:
    """
    Test that a new user is able to sign up successfully
    """

    resp = client.post(
        "/api/sign-up",
        json={
            "email": "testsignup@gmail.com",
            "password": "Testing-123",
            "user_group": MEDICAL,
        },
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 200
    ), "Error while signing up test user" + str(resp_data)
    assert (
        "access_token" in resp_data
    ), "Access token was not provided after signing up a valid user"


@pytest.mark.needs(postgres=True)
def test_no_usergroup_register(client: TestClient) -> None:
    """
    Test that a user without a user group can't make an account
    """

    resp = client.post(
        "/api/sign-up",
        json={
            "email": "nogroup@gmail.com",
            "password": "Testing-123",
        },
    )
    resp_data = resp.json()

    assert (
        resp.status_code == 400
    ), "Invalid user group error should have been returned, instead got:\n" + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_invalid_user_group_register(client: TestClient) -> None:
    """
    Test that a user without a user group can't make an account
    """

    resp = client.post(
        "/api/sign-up",
        json={
            "email": "nogroup@gmail.com",
            "password": "Testing-123",
            "user_group": "invalidGroup",
        },
    )
    resp_data = resp.json()

    assert (
        resp.status_code == 400
    ), "Invalid user group error should have been returned, instead got:\n" + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_existing_user_register(client: TestClient) -> None:
    """
    Test that a user without a user group can't make an account
    """
    db_generator = db_functions[MEDICAL]()
    db = next(db_generator)
    user = create_user(db, email="testValid@gmail.com", password="Testing-123")

    assert user, "User not created before trying to sign in a valid user."
    resp = client.post(
        "/api/sign-up",
        json={
            "email": "testValid@gmail.com",
            "password": "Testing-123",
            "user_group": MEDICAL,
        },
    )
    resp_data = resp.json()

    assert (
        resp.status_code == 409
    ), "User already exists error should have been returned, instead got:\n" + str(
        resp_data
    )
