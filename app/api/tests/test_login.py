import os
import pytest
from fastapi.testclient import TestClient

import faker


from api.constants import MEDICAL
from api.models.user import create_user
from api.main.database import SessionLocal
from api.tests.conftest import generate_user_data

MIN_PASSWORD_LENGTH = int(os.getenv("MIN_PASSWORD_LENGTH", 8))
MAX_PASSWORD_LENGTH = int(os.getenv("MAX_PASSWORD_LENGTH", 80))


faker = faker.Faker()


@pytest.fixture
def create_db_user():
    """Fixture to create a unique user in the database. Deletes the users after the test is done."""
    created_users = []

    db = SessionLocal()

    def _create_user(email, password, user_group=MEDICAL):
        user = create_user(db, email=email, password=password)
        db.commit()
        created_users.append(user)
        return user

    yield _create_user

    try:
        for user in created_users:
            db.delete(user)
            db.commit()
    finally:
        db.close()


def login_user(client: TestClient, email: str, password: str, user_group=None):
    """
    Helper function to login a user using the api
    """
    login_data = {
        "email": email,
        "password": password,
    }

    if user_group:
        login_data["user_group"] = user_group

    resp = client.post(
        "/api/login",
        json=login_data,
    )
    return resp


@pytest.mark.needs(postgres=True)
def test_valid_login(client: TestClient, create_db_user, sample_user) -> None:
    """
    Test that a created user is able to login successfully
    """
    db = SessionLocal()

    # Use the fixture to create a unique user
    user = create_db_user(**sample_user)
    assert user, "User not created before trying to sign in a valid user."

    resp = login_user(client, **sample_user)
    resp_data = resp.json()
    assert (
        resp.status_code == 200
    ), "Error while signing in test user with valid credentials" + str(resp_data)
    assert (
        "access_token" in resp_data
    ), "Access token was not provided after signing in a valid user"


@pytest.mark.needs(postgres=True)
def test_invalid_email(client: TestClient, sample_user, create_db_user) -> None:
    """ "
    Test that a user with an invalid email is unable to sign in.
    """

    # Use the fixture to create a unique user
    create_db_user(**sample_user)

    # Create a user with an invalid email
    invalid_email_user = generate_user_data(valid_email=False)
    resp = login_user(client, **invalid_email_user)
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
def test_invalid_password(client: TestClient, sample_user, create_db_user) -> None:
    """
    Test that a user with an invalid password is unable to sign in.
    """

    # Create a user
    create_db_user(**sample_user)

    # Change the password to an invalid one
    invalid_password_user = {**sample_user, "password": "ugh"}

    resp = login_user(client, **invalid_password_user)
    resp_data = resp.json()
    assert (
        resp.status_code == 422
    ), "Invalid password error should have been returned, instead got:\n" + str(
        resp_data
    )
    assert (
        "detail" in resp_data
    ), "Error data should have been returned in response, instead got:\n" + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_user_not_found(client: TestClient, sample_user) -> None:
    """
    Test that a user that does not exist is not found.
    """
    resp = login_user(client, **sample_user)
    resp_data = resp.json()
    assert (
        resp.status_code == 401
    ), "User should not have been found, instead got:\n" + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_no_user_group(client: TestClient, create_db_user) -> None:
    """
    Test that a sign in attempt without a user group fails gracefully
    """

    no_user_group_user = generate_user_data()
    no_user_group_user.pop("user_group")
    resp = login_user(client, **no_user_group_user)
    resp_data = resp.json()
    assert (
        resp.status_code == 400
    ), "Invalid user group error should have been returned, instead got:\n" + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_invalid_user_group(client: TestClient, sample_user, create_db_user) -> None:
    """
    Test that a sign in attempt with an invalid user group fails gracefully
    """

    invalid_user_group_user = generate_user_data(valid_user_group=False)

    resp = login_user(client, **invalid_user_group_user)
    resp_data = resp.json()
    assert (
        resp.status_code == 400
    ), "Invalid user group error should have been returned, instead got:\n" + str(
        resp_data
    )
