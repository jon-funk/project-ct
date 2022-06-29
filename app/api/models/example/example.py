import sqlalchemy as sa

from api.database import Base, engine
from api.models.mixins import BasicMetrics


class Example(Base, BasicMetrics):
    __tablename__ = "example"
    id = sa.Column(sa.Integer, primary_key=True, index=True)
    name = sa.Column(sa.String, index=True, unique=True)
    # nested_json = sa.Column(sa.dialects.postgresql.JSONB)