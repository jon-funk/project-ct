from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.schemas.users import UserLogin, UserLoginResponse
from api.models.user import create_user, get_user_by_email
from api.main.auth import generate_auth_token
from api.main.database import db_functions

router = APIRouter()


@router.post(
    "/sign-up", status_code=200, response_model=UserLoginResponse, name="sign-up"
)
def sign_up(user: UserLogin) -> Any:
    """
    Create a new user if a user with that email doesn't exist. Otherwise raise exceptions.
    """
    # get the correct db given the user group
    if user.user_group and user.user_group in db_functions:
        db_generator = db_functions[user.user_group]()
        db = next(db_generator)
    else:
        raise HTTPException(status_code=400, detail="Invalid user group.")

    found_user = get_user_by_email(db, str(user.email))
    if found_user:
        raise HTTPException(
            status_code=409, detail="User with that email already exists."
        )

    # otherwise if user doesn't exist
    newUser = create_user(db, email=str(user.email), password=user.password)
    if not newUser:
        raise HTTPException(
            status_code=500, detail="Unable to create user at this time."
        )

    token = generate_auth_token(
        data={"sub": newUser.email}, user_group=user.user_group
    )

    return UserLoginResponse(access_token=token)
