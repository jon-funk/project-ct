import os
import typing as T

from passlib.hash import argon2
from fastapi import Depends, HTTPException, status
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from api.database import get_db
from api.models.user import get_user_by_email


def load_current_user(token: str, db: Session = Depends(get_db)) -> T.Any:
    """
    Try and decrypt a JSON token and return the corresponding
    user from the database. Raise validation exceptions otherwise.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception

    return user


def verify_password(password_hash: str, password: str) -> bool:
    return argon2.verify(password, password_hash)


def generate_auth_token(data: dict, expires_minutes: int = 120) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")

    return encoded_jwt
