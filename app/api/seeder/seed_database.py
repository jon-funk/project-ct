from json import JSONDecodeError
from passlib.hash import argon2
from typing import List, Dict
import faker
from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from fastapi.testclient import TestClient

from api.main.app import api
from api.models import UserMedical as User, PatientEncounter
from api.main.database import get_db

from api.seeder.seeds.users import USERS
from api.seeder.generate_patient_encounters import generate_patient_encounter_data

fake = faker.Faker()


def create_authed_client(email: str, password: str, client: TestClient):
    """Create an authenticated client for testing

    Args:
        email (str): User email
        password (str): Plain text password
        client (FastAPI.TestClient): Test client to be authenticated

    Returns:
        FastAPI.TestClient: Authenticated test client
    """

    # Get token
    print(f"Creating authed client for {email}")
    login_data = {"email": email, "password": password}
    r = client.post("/api/login", json=login_data)

    # Check if login was successful
    if r.status_code != 200:
        print("create_authed_client response: ", r.json())
        raise Exception("Login failed")

    print("create_authed_client response: ", r.json())
    token = r.json()["access_token"]

    # Add authorization token header
    client.headers = {"Authorization": f"Bearer {token}"}

    return client


def create_user(user: Dict, db: Session) -> User:
    """Create a user in the database

    Args:
        user (Dict): User data
        db (Session): Database session

    Returns:
        User: User object
    """

    # Create user in database if it doesn't exist
    user_obj = db.query(User).filter(User.email == user["email"]).first()
    if user_obj:
        print(f"User {user_obj.email} already exists")
        return user_obj

    # Hash password
    hashed_password = argon2.hash(user["password"])
    # Create user
    user_obj = User(
        email=user["email"],
        hashed_password=hashed_password,
    )
    try:
        ## Add user to database
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)
        print(f"User {user_obj.email} created with uuid: {user_obj.user_uuid}")
        return user_obj
    except Exception as e:
        print(e)
        db.rollback()
        db.flush()
        print(f"User {user_obj.email} already exists")
        return user_obj


def generate_random_users(num_users: int, db: Session) -> List[User]:
    """Generate random mock users

    Args:
        num_users (int): Number of users to generate
        db (Session): Database session

    Returns:
        List[User]: List of created users
    """

    # Generate mock user data
    created_users = []
    for _ in range(num_users):
        user = {
            "email": fake.email(),
            "password": fake.password(
                length=12,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            ),
        }
        created_users.append(user)

    return created_users


def seed_database():
    """Seed database with mock data."""

    db = next(get_db())

    # Create test client and check if healthy
    client = TestClient(api)
    r = client.get("/api/")
    if r.json()["status"] == "healthy":
        print("API is healthy")

    # Create users
    num_of_generated_users = 10
    created_user_uuids = generate_random_users(num_of_generated_users, db)

    users = USERS + created_user_uuids

    created_user_objs = []

    for user in users:
        created_user = create_user(user, db)
        created_user_objs.append(created_user)

    # Get user uuids
    created_user_uuids = [user.user_uuid for user in created_user_objs]

    # Create 2023 festival patient encounters
    patient_encounters_2023 = generate_patient_encounter_data(
        start_date=datetime.strptime("2023-07-20T00:00:00", "%Y-%m-%dT%H:%M:%S"),
        end_date=datetime.strptime("2023-07-24T23:59:59", "%Y-%m-%dT%H:%M:%S"),
        user_uuids=created_user_uuids,
        num_encounters=100,
    )

    # Populate database with patient encounters using ORM
    counter = 0
    for patient_encounter in patient_encounters_2023:
        # Combine date and time into datetime objects
        arrival_datetime = datetime.combine(
            patient_encounter["arrival_date"], patient_encounter["arrival_time"]
        )
        departure_datetime = datetime.combine(
            patient_encounter["departure_date"], patient_encounter["departure_time"]
        )

        patient_encounter["arrival_time"] = arrival_datetime
        patient_encounter["departure_time"] = departure_datetime

        # Create patient encounter
        patient_encounter_obj = PatientEncounter(**patient_encounter)
        try:
            ## Add patient encounter to database
            db.add(patient_encounter_obj)
            db.commit()
            db.refresh(patient_encounter_obj)
            counter += 1
        except Exception as e:
            print(e)
            db.rollback()
            db.flush()
            print(f"ERROR creating patient encounter: {patient_encounter}")
            print(f"\tERROR: {e}")

    print(f"Created {counter} patient encounters for 2023 festival")


if __name__ == "__main__":
    seed_database()
