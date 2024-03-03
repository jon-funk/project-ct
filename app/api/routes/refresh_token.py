from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.schemas.users import UserLogin, UserLoginResponse
from api.main.auth import load_current_user, generate_auth_token, get_user_group


router = APIRouter()


@router.get(
    "/refresh-token",
    status_code=200,
    response_model=UserLoginResponse,
    name="refresh-token",
)
def refresh_token(
    loaded_user: BaseModel = Depends(load_current_user), user_group: str = Depends(get_user_group)
) -> Any:
    """
    Verify a user provided token and provide a token with an updated expiration.
    """
    token = generate_auth_token(
        data={"sub": loaded_user.email}, user_group=user_group
    )

    return UserLoginResponse(access_token=token)
