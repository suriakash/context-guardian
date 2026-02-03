from sqlalchemy import Column, String, DateTime, Text
from database import Base
import datetime

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    project_id = Column(String, index=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
