---
name: pydantic-validation
description: Valida datos con Pydantic schemas
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers
  category: implementation
---

# Skill: Pydantic Validation

## Propósito

Validar y serializar datos usando Pydantic v2 de manera efectiva.

## Cuándo Usar

- Request/response schemas
- Validación de datos de entrada
- Serialización de modelos

## Schemas Básicos

```python
# app/schemas/__init__.py
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List

# Base schemas
class BaseModelWithConfig(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,  # ORM mode
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
    """Schema para actualizar actividad (todos los campos opcionales)."""
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
    
    model_config = ConfigDict(from_attributes=True)

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
    
    model_config = ConfigDict(from_attributes=True)

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
    
    model_config = ConfigDict(from_attributes=True)

class HabitCompletionResponse(BaseModelWithConfig):
    id: int
    date: datetime
    completed: bool
    notes: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

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
    consistency_score: float  # 0-100

# Chat/LLM Schemas
class ChatRequest(BaseModelWithConfig):
    query: str = Field(..., min_length=1, max_length=1000)
    context_window: int = Field(default=30, ge=1, le=365)

class ChatResponse(BaseModelWithConfig):
    answer: str
    sources: List[str] = []
    confidence: float = Field(..., ge=0, le=1)
```

## Validadores Custom

```python
from pydantic import field_validator, model_validator

class ActivityCreate(ActivityBase):
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()
    
    @field_validator('color')
    @classmethod
    def validate_color(cls, v):
        if not v.startswith('#'):
            raise ValueError('Color must start with #')
        return v.upper()
    
    @model_validator(mode='after')
    def validate_category_color(self):
        # Validación cruzada entre campos
        if self.category == "work" and not self.color:
            self.color = "#EF4444"  # Rojo para trabajo
        return self
```

## Enums

```python
from enum import Enum

class CategoryEnum(str, Enum):
    study = "study"
    work = "work"
    exercise = "exercise"
    sleep = "sleep"
    leisure = "leisure"
    other = "other"

class ActivityBase(BaseModelWithConfig):
    category: CategoryEnum = Field(default=CategoryEnum.other)
```
