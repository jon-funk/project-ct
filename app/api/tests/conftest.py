import os
from functools import lru_cache
from typing import Generator

import psycopg2
import pytest
from fastapi.testclient import TestClient

from api.constants import MEDICAL
from api.main.app import api
from api.main import database
from api.main.auth import generate_auth_token
from api.models.user import create_user, get_user_by_email


@pytest.fixture(scope="session")
def default_user() -> dict:
    return {
        "email": "justice_beaver@justforbeavers.ca",
        "password": "You-st0le-my-purse",
    }


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
