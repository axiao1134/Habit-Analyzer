from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional, List

# Base config for all schemas
class BaseModelWithConfig(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True,
        populate_by_name=True
    )

# Activity Schemas
class ActivityBase(BaseModelWithConfig):
    name: str = Field(..., min_length=1, max_length=100, description="Nombre de la actividad")
    description: Optional[str] = Field(None, max_length=500)
    category: str = Field(default="general", pattern="^[a-z]+$")
    color: str = Field(default="#3B82F6", pattern="^#[0-9A-Fa-f]{6}$")

class ActivityCreate(ActivityBase):
    """Schema para crear actividad."""
    pass

class ActivityUpdate(BaseModelWithConfig):
    """Schema para actualizar actividad (campos opcionales)."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, pattern="^[a-z]+$")
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")

class ActivityResponse(ActivityBase):
    """Schema para respuesta de actividad."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

# ActivityRecord Schemas
class ActivityRecordBase(BaseModelWithConfig):
    activity_id: int = Field(..., gt=0)
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=1000)

class ActivityRecordCreate(ActivityRecordBase):
    """Schema para crear registro de actividad."""
    pass

class ActivityRecordResponse(ActivityRecordBase):
    id: int
    user_id: int
    completed: bool

# Habit Schemas
class HabitBase(BaseModelWithConfig):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    target_days: str = Field(default="MTWTFSS", pattern="^[MTWTFSS]*$")
    target_duration: int = Field(default=1800, ge=60, le=86400)

class HabitCreate(HabitBase):
    pass

class HabitResponse(HabitBase):
    id: int
    user_id: int
    streak: int
    best_streak: int
    created_at: datetime
    completions: List["HabitCompletionResponse"] = []

class HabitCompletionResponse(BaseModelWithConfig):
    id: int
    date: datetime
    completed: bool
    notes: Optional[str] = None

# Statistics Schemas
class ActivityStats(BaseModelWithConfig):
    category: str
    total_duration: int
    total_sessions: int
    average_duration: float

class WeeklyProgress(BaseModelWithConfig):
    week_start: datetime
    week_end: datetime
    total_hours: float
    activities_completed: int
    consistency_score: float

# Chat/LLM Schemas
class ChatRequest(BaseModelWithConfig):
    query: str = Field(..., min_length=1, max_length=1000)
    context_window: int = Field(default=30, ge=1, le=365)

class ChatResponse(BaseModelWithConfig):
    answer: str
    sources: List[str] = []
    confidence: float = Field(..., ge=0, le=1)

# Reminder Schemas
class ReminderRequest(BaseModelWithConfig):
    user_id: int
    habit_id: int
    scheduled_time: str
