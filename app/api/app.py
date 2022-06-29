import os
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# from api.database import get_db
from api import routes, models, schemas, constants

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


# TODO: Implement health model with intelligent checks
@api.get("/health")
@api.get("/")
def health_check():
    health_msg = {"status": "healthy"}
    return health_msg


# commented out since the Example schema doesn't exist
# @api.get("/example/", response_model=List[schemas.Example])
# def get_example_list(skip: int = 0,
#                      limit: int = 100,
#                      db: Session = Depends(get_db)):
#     results = db.query(models.example.Example).offset(skip).limit(limit).all()
#     return results


# @api.get("/example/{id}", response_model=schemas.Example)
# def get_example(id: int, db: Session = Depends(get_db)):
#     results = db.query(models.example.Example).filter(
#         models.example.Example.id == id).first()
#     return results


# @api.post("/example/", response_model=schemas.Example)
# def create_example(example: schemas.Example, db: Session = Depends(get_db)):
#     if_example_exists = db.query(models.example.Example).filter(
#         models.example.Example.id == example.id).first()
#     if if_example_exists:
#         raise HTTPException(status_code=400, detail="Example already exists")
#     new_example = models.example.Example(id=example.id, name=example.name)
#     db.add(new_example)
#     db.commit()
#     db.refresh(new_example)
#     return new_example


# @api.put("/example/", response_model=schemas.Example)
# def put_example(example: schemas.Example, db: Session = Depends(get_db)):
#     if_example_exists = db.query(models.example.Example).filter(
#         models.example.Example.id == example.id).first()
#     if if_example_exists:
#         new_example = if_example_exists
#         new_example.name = example.name
#     else:
#         new_example = models.example.Example(id=example.id, name=example.name)
#     db.add(new_example)
#     db.commit()
#     db.refresh(new_example)
#     return new_example


