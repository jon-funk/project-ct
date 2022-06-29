from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.schemas.users import UserLogin, UserLoginResponse
from api.models.user import get_user_by_email
from api.auth import verify_password, generate_auth_token
from api.database import get_db

router = APIRouter()


@router.post("/login", status_code=200, response_model=UserLoginResponse, name="login")
def login_user(user: UserLogin, db: Session = Depends(get_db)) -> Any:
    """
    Login a user if they provide a matching email and password to one found in the database,
    otherwise return exceptions.
    """
    found_user = get_user_by_email(db, user.email)
    if found_user is None:
        raise HTTPException(
            status_code=401, detail="Unable to retrieve a user with those credentials."
        )

    if not verify_password(found_user.hashed_password, user.password):
        raise HTTPException(
            status_code=401, detail="Username and password do not match."
        )

    token = generate_auth_token(data={"sub": found_user.email})

    return UserLoginResponse(access_token=token)
