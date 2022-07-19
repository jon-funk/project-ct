from pydoc import doc
from typing import Any, Optional

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import User
from api.models.patient_encounter import get_patient_encounter_by_document_number
from api.schemas.patient_encounter import PatientEncounterList, PatientEncounterSchema


@router.get("/patient-encounter", status_code=200, response_model=PatientEncounterList, name="get-patient-encounter")
def get_patient_encounter(document_number: int, loaded_user: User = Depends(load_current_user), db: Session = Depends(get_db)) -> Any:
    """
    Retrieve all patient encounters from the database and return a list of patient encounters.
    """
    encounter = get_patient_encounter_by_document_number(db=db, document_number=document_number)
    if not encounter:
        raise HTTPException(status_code=404, detail="Unable to find an entry with that document id.")

    return PatientEncounterSchema.from_orm(encounter)
