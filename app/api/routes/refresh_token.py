from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.schemas.users import UserLogin, UserLoginResponse
from api.main.auth import load_current_user, generate_auth_token, get_user_group
from api.main.database import get_db
from api.models.user import UserMedical as User

router = APIRouter()


@router.get(
    "/refresh-token",
    status_code=200,
    response_model=UserLoginResponse,
    name="refresh-token",
)
def refresh_token(
    loaded_user: User = Depends(load_current_user), user_group: User = Depends(get_user_group), db: Session = Depends(get_db)
) -> Any:
    """
    Verify a user provided token and provide a token with an updated expiration.
    """
    token = generate_auth_token(
        data={"sub": loaded_user.email}, user_group=user_group
    )

    return UserLoginResponse(access_token=token)
