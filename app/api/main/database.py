import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

from api.config import load_env


load_env()
user = os.environ.get("POSTGRES_USER")
password = os.environ.get("POSTGRES_PASSWORD")
hostname = os.environ.get("POSTGRES_HOST")
port = str(os.environ.get("POSTGRES_PORT"))
db = os.environ.get("POSTGRES_DB")

SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{user}:{password}@{hostname}:{port}/{db}"
)

# TODO: rename "example" database to medical
# Engine for the 'medical' database
engine_example = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{hostname}:{port}/example"
)
if not database_exists(engine_example.url):  # Check if the db exists
    create_database(engine_example.url)  # Create new DB

# TODO: Rename sessionLocal to sessionLocalMedical
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_example)

# TODO: rename this to MedicalBase
Base = declarative_base()
BaseSanctuary = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables() -> None:
    Base.metadata.create_all(engine_example, checkfirst=True)
    BaseSanctuary.metadata.create_all(engine_example, checkfirst=True)


def drop_all_tables(check_first: bool = False) -> None:
    Base.metadata.drop_all(engine_example, checkfirst=check_first)
    BaseSanctuary.metadata.drop_all(engine_example, checkfirst=check_first)
