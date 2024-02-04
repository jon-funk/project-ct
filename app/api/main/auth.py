import os
import typing as T

from passlib.hash import argon2
from fastapi import HTTPException, Request, status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from api.main.database import db_functions
from api.models.user import get_user_by_email


security = HTTPBearer()

# The medical load user function
def load_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> T.Any:
    """
    Try and decrypt a JSON token and return the corresponding
    user from the database. Checks if user in in the right user_group. Raise validation exceptions otherwise.
    """

    # Fetch the function based on user group and call it
    token = credentials.credentials

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        email: str = payload.get("sub")
        user_group: str = payload.get("user_group")  # Extract user group from the token
        if email is None or user_group != "medical":
            raise get_credentials_exeption()
    except JWTError:
        raise get_credentials_exeption()
    if user_group in db_functions:
        db_generator = db_functions[user_group]()
        db = next(db_generator)
    else:
        raise HTTPException(status_code=400, detail="Invalid user group.")
    user = get_user_by_email(db, email)
    if user is None:
        raise get_credentials_exeption()

    return user

# get the user group. required for refreshing the token
def get_user_group(
    request: Request, credentials: HTTPAuthorizationCredentials = Security(security)
) -> T.Any:

    token = credentials.credentials

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_group: str = payload.get("user_group")  # Extract user group from the token
    except JWTError:
        raise get_credentials_exeption()
    
    return user_group


# Sanctuary load user function
def load_current_sanctuary_user(
    request: Request, credentials: HTTPAuthorizationCredentials = Security(security)
) -> T.Any:
    """
    Try and decrypt a JSON token and return the corresponding
    user from the database. Checks if user in in the right user_group. Raise validation exceptions otherwise.
    """

    token = credentials.credentials

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        email: str = payload.get("sub")
        user_group: str = payload.get("user_group")  # Extract user group from the token
        if email is None or user_group != "sanctuary":
            raise get_credentials_exeption()
    except JWTError:
        raise get_credentials_exeption()

    # Fetch the function based on user group and call it
    if user_group in db_functions:
        db = db_functions[user_group]()
    else:
        raise HTTPException(status_code=400, detail="Invalid user group.")

    user = get_user_by_email(db, email)
    if user is None:
        raise get_credentials_exeption()

    return user


def verify_password(password_hash: str, password: str) -> bool:
    return argon2.verify(password, password_hash)


def generate_auth_token(data: dict, user_group: str, expires_minutes: int = 60 * 24) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update(
        {"exp": expire, "user_group": user_group}  # Add user group to the token payload
    )
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")
    return encoded_jwt


def get_credentials_exeption() -> HTTPException:

    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
