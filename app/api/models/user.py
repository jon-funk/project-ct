import uuid
from datetime import datetime
from typing import Union

from passlib.hash import argon2
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session

from api.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    email = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


def get_user_by_email(db: Session, email: str) -> Union[User, None]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, password: str) -> User:
    """Create a new user with the provided valid credentials.

    Params:
        db: A database session.
        user: User data that has already been validated.

    Returns:
        A UserResponse schema with all fields included except the access token.
    """
    password_hash = argon2.hash(password)
    created_user = User(
        email=email,
        hashed_password=password_hash,
    )
    db.add(created_user)
    db.commit()
    db.refresh(created_user)

    return created_user