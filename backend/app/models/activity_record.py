from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base

class ActivityRecord(Base):
    """ActivityRecord model for tracking activity sessions."""
    __tablename__ = "activity_records"
    
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    notes = Column(String, nullable=True)
    completed = Column(Boolean, default=True)
    
    # Relationships
    activity = relationship("Activity", back_populates="records")
    user = relationship("User", back_populates="activity_records")
