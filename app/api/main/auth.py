import os
import typing as T

from passlib.hash import argon2
from fastapi import HTTPException, Request, status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from api.constants import MEDICAL, SANCTUARY, USER_GROUPS
from api.main.database import db_functions
from api.models.user import get_user_by_email


security = HTTPBearer()


def load_current_user(
    request: Request, credentials: HTTPAuthorizationCredentials = Security(security)
) -> T.Any:
    """
    Try and decrypt a JSON token and return the corresponding
    user from the database. Checks if user in in the right user_group. Raise validation exceptions otherwise.
    """

    # determine user credentials
    token = credentials.credentials

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        email: str = payload.get("sub")
        user_group: str = payload.get("user_group")
        if email is None or user_group not in USER_GROUPS:
            raise get_credentials_exception()
    except JWTError:
        raise get_credentials_exception()

    # Fetch the function based on user group and call it
    if user_group in db_functions:
        db_generator = db_functions[user_group]()
        db = next(db_generator)
    else:
        raise HTTPException(status_code=400, detail="Invalid user group.")

    # fetch user from db based on credentials
    user = get_user_by_email(db, email)
    if user is None:
        raise get_credentials_exception()

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
        raise get_credentials_exception()

    return user_group


def verify_password(password_hash: str, password: str) -> bool:
    return argon2.verify(password, password_hash)


def generate_auth_token(
    data: dict, user_group: str, expires_minutes: int = 60 * 24
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update(
        {"exp": expire, "user_group": user_group}  # Add user group to the token payload
    )
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")
    return encoded_jwt


def get_credentials_exception() -> HTTPException:

    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
