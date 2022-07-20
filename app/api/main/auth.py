import os
import typing as T

from passlib.hash import argon2
from fastapi import Depends, HTTPException, Request, status
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from api.main.database import get_db
from api.models.user import get_user_by_email


def load_current_user(request: Request, db: Session = Depends(get_db)) -> T.Any:
    """
    Try and decrypt a JSON token and return the corresponding
    user from the database. Raise validation exceptions otherwise.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not "Authorization" in request.headers:
        raise credentials_exception

    token = request.headers["Authorization"]
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token not included in request.",
        )

    words = token.split(" ")
    if len(words) < 2:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Improperly formatted bearer token",
        )

    token = words[1]

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


def generate_auth_token(data: dict, expires_minutes: int = 60 * 24) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")

    return encoded_jwt
