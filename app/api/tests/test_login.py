import pytest
from fastapi.testclient import TestClient

from api.constants import MEDICAL
from api.models.user import create_user
from api.main.database import SessionLocal


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


@pytest.fixture
def sample_user():
    return {
        "email": "test_unique_email@gmail.com",
        "password": "Testing-123",
        "user_group": MEDICAL,
    }


@pytest.mark.needs(postgres=True)
def test_valid_login(client: TestClient, create_db_user, sample_user) -> None:
    """
    Test that a created user is able to login successfully
    """
    db = SessionLocal()

    # Use the fixture to create a unique user
    user = create_db_user(**sample_user)
    assert user, "User not created before trying to sign in a valid user."

    resp = client.post(
        "/api/login",
        json={
            "email": sample_user["email"],
            "password": sample_user["password"],
            "user_group": sample_user["user_group"],
        },
    )
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

    # Change the email to an invalid one
    sample_user["email"] = "invalidemail.com"

    resp = client.post(
        "/api/login",
        json={
            "email": sample_user["email"],
            "password": sample_user["password"],
            "user_group": sample_user["user_group"],
        },
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
def test_invalid_password(client: TestClient, sample_user, create_db_user) -> None:
    """
    Test that a user with an invalid password is unable to sign in.
    """

    # Create a user
    create_db_user(**sample_user)

    # Change the password to an invalid one
    sample_user["password"] = "invalidpassword"

    resp = client.post(
        "/api/login",
        json={
            "email": sample_user["email"],
            "password": sample_user["password"],
            "user_group": sample_user["user_group"],
        },
    )
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
    resp = client.post(
        "/api/login",
        json={
            "email": sample_user["email"],
            "password": sample_user["password"],
            "user_group": sample_user["user_group"],
        },
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 401
    ), "User should not have been found, instead got:\n" + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_no_user_group(client: TestClient, sample_user, create_db_user) -> None:
    """
    Test that a sign in attempt without a user group fails gracefully
    """

    create_db_user(**sample_user)
    resp = client.post(
        "/api/login",
        json={"email": sample_user["email"], "password": sample_user["password"]},
    )
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

    create_db_user(**sample_user)

    resp = client.post(
        "/api/login",
        json={
            "email": sample_user["email"],
            "password": sample_user["password"],
            "user_group": "invalidUserGroup",
        },
    )
    resp_data = resp.json()
    assert (
        resp.status_code == 400
    ), "Invalid user group error should have been returned, instead got:\n" + str(
        resp_data
    )
