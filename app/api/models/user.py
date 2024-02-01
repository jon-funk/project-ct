import uuid
from datetime import datetime
from typing import Union

from passlib.hash import argon2
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session

from api.main.database import Base, BaseSanctuary
from api.models.mixins import BasicMetrics

class User(BasicMetrics):

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    email = Column(String)
    hashed_password = Column(String)

# for Sanctuary
class UserSanctuary(User, BaseSanctuary):
    __tablename__ = "users"

# For medical
class UserMedical(User, Base):
    __tablename__ = "users"


def get_user_by_email(db: Session, email: str) -> Union[User, None]:
    return db.query(UserMedical).filter(UserMedical.email == email).first()


def create_user(db: Session, email: str, password: str) -> UserMedical:
    """Create a new user with the provided valid credentials.

    Params:
        db: A database session.
        user: UserMedical data that has already been validated.

    Returns:
        A UserMedicalResponse schema with all fields included except the access token.
    """
    password_hash = argon2.hash(password)
    created_user = UserMedical(
        email=email,
        hashed_password=password_hash,
    )
    db.add(created_user)
    db.commit()
    db.refresh(created_user)

    return created_user
