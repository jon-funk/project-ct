import uuid
import os
from datetime import datetime
from typing import Union

from passlib.hash import argon2
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session
from pydantic import BaseModel

from api.main.database import BaseMedical, BaseSanctuary
from api.models.mixins import BasicMetrics
from api.constants import MEDICAL, SANCTUARY
from api.config import load_env

class User(BasicMetrics):

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    email = Column(String)
    hashed_password = Column(String)

# for Sanctuary
class UserSanctuary(User, BaseSanctuary):
    __tablename__ = "users"


# For medical
class UserMedical(User, BaseMedical):
    __tablename__ = "users"


# constant for accessing User Class
USER_GROUPS = {MEDICAL: UserMedical, SANCTUARY: UserSanctuary}

def get_user_by_email(db: Session, email: str) -> Union[User, None]:

    user_group = get_user_group_from_db(db=db)
    return (
        db.query(USER_GROUPS[user_group])
        .filter(USER_GROUPS[user_group].email == email)
        .first()
    )


def create_user(db: Session, email: str, password: str) -> BaseModel:
    """Create a new user with the provided valid credentials.

    Params:
        db: A database session.
        email: user email
        password: user password

    Returns:
        A UserResponse schema with all fields included except the access token.
    """
    password_hash = argon2.hash(password)

    user_group = get_user_group_from_db(db=db)
    created_user = USER_GROUPS[user_group](
        email=email,
        hashed_password=password_hash,
    )
    db.add(created_user)
    db.commit()
    db.refresh(created_user)

    return created_user


def get_user_group_from_db(db: Session) -> str:
    # determine which DB is being used
    url = str(db.get_bind().url)

    load_env()
    # Determine user group based on environment variable and URL
    user_group = MEDICAL if os.environ.get("POSTGRES_DB") in url else SANCTUARY
    return user_group
