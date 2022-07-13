from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String

class BasicMetrics():
    created_timestamp = Column(DateTime, default=datetime.utcnow)
    last_updated_timestamp = Column(DateTime, onupdate=datetime.utcnow)

# TODO: implement list of column to class columns conversion method
class AutoColumn():
    @classmethod
    def auto_column(columns):
        raise NotImplementedError
