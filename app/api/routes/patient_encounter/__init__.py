from fastapi import APIRouter

router = APIRouter()

from . import get_patient_encounters
from . import submit_patient_encounter
