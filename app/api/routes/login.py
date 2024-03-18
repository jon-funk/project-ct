from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime

from api.schemas.users import UserLogin, UserLoginResponse
from api.models.user import get_user_by_email
from api.main.auth import verify_password, generate_auth_token
from api.main.database import db_functions

import logging
import yaml

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/login", status_code=200, response_model=UserLoginResponse, name="login")
def login_user(user: UserLogin, request: Request) -> Any:
    """
    Login a user if they provide a matching email and password to one found in the database,
    otherwise return exceptions.
    """
    client_host = request.client.host
    # Determine which database to use based on the user group
    if user.user_group and user.user_group in db_functions:
        db_generator = db_functions[user.user_group]()
        db = next(db_generator)
    else:
        logger.info(
            f"User '{user.email}' login attempt failed due to: invalid user group at {datetime.now()} from IP address {client_host}"
        )
        raise HTTPException(status_code=400, detail="Invalid user group.")

    found_user = get_user_by_email(db, str(user.email))
    if found_user is None:
        logger.info(
            f"User '{user.email}' login attempt failed due to: no user found with those credentials at {datetime.now()} from IP address {client_host}"
        )
        raise HTTPException(
            status_code=401, detail="Unable to retrieve a user with those credentials."
        )

    if not verify_password(found_user.hashed_password, user.password):
        logger.info(
            f"User '{user.email}' login attempt failed due to: mismatched user and password at {datetime.now()} from IP address {client_host}"
        )
        raise HTTPException(
            status_code=401, detail="Username and password do not match."
        )

    token = generate_auth_token(data={"sub": found_user.email}, user_group=user.user_group)
    logger.info(
        f"User '{user.email}' has successfully logged in at {datetime.now()} from IP address {client_host}"
    )

    return UserLoginResponse(access_token=token)
