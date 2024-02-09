import pytest
from fastapi.testclient import TestClient

from api.constants import MEDICAL
from api.models.user import create_user
from api.main.database import SessionLocal


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
