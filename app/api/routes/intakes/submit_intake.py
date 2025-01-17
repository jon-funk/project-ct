import logging

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router
from api.constants import SANCTUARY

from api.main.auth import load_current_user
from api.main.database import get_db_sanctuary as get_db
from api.models.user import UserSanctuary as User
from api.models.intake import create_intake, Intake
from api.schemas.intake import (
    IntakeSchema,
    IntakeResponseSchema,
)

LOGGER = logging.getLogger(__name__)


@router.post(
    f"/{SANCTUARY}/form",
    status_code=200,
    response_model=IntakeResponseSchema,
    name=f"create-{SANCTUARY}-form",
    tags=[SANCTUARY],
)
def post_intake(
    data: IntakeSchema,
    loaded_user: User = Depends(load_current_user),
    db: Session = Depends(get_db),
) -> IntakeResponseSchema:
    """
    Create a new intake.
    """
    new_intake = Intake(**dict(data))
    new_intake.user_uuid = loaded_user.user_uuid
    try:
        intake = create_intake(db, new_intake)
    except Exception as err:
        LOGGER.error(f"Server error while trying to create intake: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to create intake at this time. Please try again later or contact support.",
        )

    return IntakeResponseSchema.from_orm(intake)
