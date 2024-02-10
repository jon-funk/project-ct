import os
from functools import lru_cache
from typing import Generator

import psycopg2
import pytest
from fastapi.testclient import TestClient
import faker

from api.constants import MEDICAL
from api.main.app import api
from api.main import database
from api.main.auth import generate_auth_token
from api.models.user import create_user, get_user_by_email

# Get environment variables
MIN_PASSWORD_LENGTH = int(os.getenv("MIN_PASSWORD_LENGTH", 8))
MAX_PASSWORD_LENGTH = int(os.getenv("MAX_PASSWORD_LENGTH", 80))

# Create a Faker instance
faker = faker.Faker()


@pytest.fixture(scope="session")
def default_user() -> dict:
    return {
        "email": "justice_beaver@justforbeavers.ca",
        "password": "You-st0le-my-purse",
    }


def generate_user_data(valid_email=True, valid_password=True, valid_user_group=True):
    """
    Generate random user data for testing purposes.
    """

    if MAX_PASSWORD_LENGTH < MIN_PASSWORD_LENGTH:
        raise ValueError(
            "MAX_PASSWORD_LEN must be greater than or equal to MIN_PASSWORD_LEN"
        )

    # Generate password
    if valid_password:
        password_length = faker.random_int(
            min=MIN_PASSWORD_LENGTH, max=MAX_PASSWORD_LENGTH
        )
        password = faker.password(
            length=password_length,
            special_chars=True,
            digits=True,
            upper_case=True,
            lower_case=True,
        )
    else:
        password = "123"

    # Generate email
    email = faker.email() if valid_email else "invalidemail"

    # Generate user group
    user_group = MEDICAL if valid_user_group else "invalid_user_group"

    return {
        "email": email,
        "password": password,
        "user_group": user_group,
    }


@pytest.fixture
def sample_user(scope="function"):
    """
    Generate a random valid user for testing purposes.
    """
    return generate_user_data()


def pytest_configure(config):
    """
    Registering a pytest marker that will only run tests that require data services
    if those services are ready to accept connections. See this pytest doc here:
        https://docs.pytest.org/en/stable/how-to/mark.html

    and below function: 'pytest_runtest_setup' for more background on this.
    """
    config.addinivalue_line(
        "markers",
        "needs(*): mark test to run only when dependencies are available.",
    )


@lru_cache
def postgres_is_running() -> bool:
    """
    Function returns True if Postgres is ready to accept database connections,
     False otherwise.
    """
    try:
        connection = psycopg2.connect(
            database=os.getenv("POSTGRES_DB"),
            host=os.getenv("POSTGRES_HOST"),
            port=str(os.getenv("POSTGRES_PORT")),
            password=os.getenv("POSTGRES_PASSWORD"),
            user=os.getenv("POSTGRES_USER"),
            connect_timeout=1,
        )
        connection.close()
        return True
    except (Exception, psycopg2.DatabaseError):
        pass

    return False


def pytest_runtest_setup(item):
    """
    Checks to see if a test case should run based on the specified 'needs' pytest marker.
    """
    marker = item.get_closest_marker(name="needs")
    needs = marker.kwargs if marker else {}

    if needs.get("postgres", False) and not postgres_is_running():
        pytest.skip("Skipped test case because Postgres is not available.")


@pytest.fixture(autouse=True, scope="session")
def setup_and_teardown_db(request) -> None:
    """
    Set up the database at the start of the pytest session, and then
    tear down all created tables once tests have completed
    """

    database.drop_all_tables(check_first=True)

    database.create_all_tables()

    def teardown():
        database.drop_all_tables()

    request.addfinalizer(teardown)


@pytest.fixture(scope="session")
def client(request) -> Generator:
    """
    Add FastAPI test client for duration of the test case.
    """
    yield TestClient(api)


@pytest.mark.usefixtures("client")
@pytest.fixture(scope="module")
def auth_header(client: TestClient, default_user) -> Generator:
    """
    Create a user and return an authentication token for that user.
    """
    user = get_user_by_email(next(database.get_db()), default_user["email"])
    if not user:
        user = create_user(
            next(database.get_db()),
            email=default_user["email"],
            password=default_user["password"],
        )

    token = "Bearer " + generate_auth_token(
        data={"sub": user.email}, user_group=MEDICAL
    )
    yield {"Authorization": token}
