import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from api.config import load_env

load_env()
user = os.environ.get("POSTGRES_USER")
password = os.environ.get("POSTGRES_PASSWORD")
hostname = os.environ.get("POSTGRES_HOST")
port = str(os.environ.get("POSTGRES_PORT"))
db = os.environ.get("POSTGRES_DB")

SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{hostname}:{port}/{db}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables() -> None:
    Base.metadata.create_all(engine, checkfirst=True)


def drop_all_tables(check_first: bool = False) -> None:
    Base.metadata.drop_all(engine, checkfirst=check_first)