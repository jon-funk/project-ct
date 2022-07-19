import os
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from api import routes, constants


fe_origin = os.environ.get("FRONTEND_ORIGIN")
protocol = os.environ.get("PROTOCOL")

origins = [
    f"{protocol}://{fe_origin}",
]

api = FastAPI(title=constants.API_TITLE,
                      description=constants.API_DESCRIPTION,
                      version=constants.API_VERSION)
api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api.include_router(routes.login.router)
api.include_router(routes.register.router)
api.include_router(routes.refresh_token.router)
api.include_router(routes.patient_encounter.router)

# TODO: Implement health model with intelligent checks
@api.get("/health")
@api.get("/")
def health_check():
    health_msg = {"status": "healthy"}
    return health_msg
