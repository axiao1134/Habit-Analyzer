from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base

class Habit(Base):
    """Habit model for recurring habits."""
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_days = Column(String, default="MTWTFSS")
    target_duration = Column(Integer, default=1800)
    streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="habits")
    completions = relationship("HabitCompletion", back_populates="habit", cascade="all, delete-orphan")

class HabitCompletion(Base):
    """HabitCompletion model for tracking habit completions."""
    __tablename__ = "habit_completions"
    
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    date = Column(DateTime, nullable=False, index=True)
    completed = Column(Boolean, default=True)
    notes = Column(String, nullable=True)
    
    # Relationships
    habit = relationship("Habit", back_populates="completions")
