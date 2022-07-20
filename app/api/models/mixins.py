from datetime import datetime
from sqlalchemy import Column, DateTime, Boolean


class BasicMetrics:
    created_timestamp = Column(DateTime, default=datetime.utcnow)
    last_updated_timestamp = Column(DateTime, onupdate=datetime.utcnow)
    deleted = Column(Boolean, default=False)


# TODO: implement list of column to class columns conversion method
class AutoColumn:
    @classmethod
    def auto_column(columns):
        raise NotImplementedError
