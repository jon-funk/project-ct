from json import JSONDecodeError
from passlib.hash import argon2
from typing import List, Dict

from sqlalchemy.orm import Session
from fastapi.testclient import TestClient

from api.main.app import api
from api.models import User
from api.main.database import get_db

from api.seeder.seeds.users import USERS

def create_authed_client(email: str, password: str, client: TestClient):
    """ Create an authenticated client for testing

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
    r = client.post("/api/sign-in", json=login_data)
    print("create_authed_client response: ", r.json())
    token = r.json()["access_token"]

    # Add authorization token header
    client.headers = {"Authorization": f"Bearer {token}"}

    return client


def create_users(users: List[Dict], db: Session) -> List[User]:
    """ Create users in database

    Args:
        users (List[Dict]): List of users to create
        db (Session): Database session

    Returns:
        List[User]: List of created users
    """

    created_users = []

    # Create users
    for user in users:

        # Check if user already exists
        user_obj = db.query(User).filter(User.email == user["email"]).first()
        if user_obj:
            print(f"User {user_obj.email} already exists")
            created_users.append(user_obj)
            continue

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

            # Check if default user has uuid
            if user_obj.user_uuid:
                print(
                    f"User {user_obj.email} created with uuid: {user_obj.user_uuid}"
                )

                created_users.append(user_obj)
            else:
                print("Default user created without uuid")
        except Exception as e:
            print(e)
            db.rollback()
            db.flush()
            print(f"User {user_obj.email} already exists")

    return created_users

def seed_database():
    """ Seed database with mock data.
    """

    db = next(get_db())

    # Create test client and check if healthy
    client = TestClient(api)
    r = client.get("/api/")
    if r.json()["status"] == "healthy":
        print("API is healthy")

    # Create users
    created_users = create_users(USERS, db)

    
if __name__ == "__main__":
    seed_database()