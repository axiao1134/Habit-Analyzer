---
name: sqlalchemy-orm
description: Modela datos con SQLAlchemy ORM y relaciones
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers
  category: implementation
---

# Skill: SQLAlchemy ORM

## Propósito

Modelar datos y relaciones usando SQLAlchemy ORM de manera efectiva.

## Cuándo Usar

- Definir modelos de base de datos
- Crear relaciones entre tablas
- Queries complejos

## Configuración Base

```python
# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./habits.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    echo=True,  # Log SQL queries
    pool_pre_ping=True  # Connection health check
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Modelos con Relaciones

```python
# app/models/__init__.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships - back_populates debe coincidir
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    activity_records = relationship("ActivityRecord", back_populates="user")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    category = Column(String, default="general", index=True)
    color = Column(String, default="#3B82F6")  # Para UI
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="activities")
    records = relationship("ActivityRecord", back_populates="activity", cascade="all, delete-orphan")

class ActivityRecord(Base):
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

class Habit(Base):
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_days = Column(String, default="MTWTFSS")  # Lunes a Domingo
    target_duration = Column(Integer, default=1800)  # 30 minutos en segundos
    streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="habits")
    completions = relationship("HabitCompletion", back_populates="habit", cascade="all, delete-orphan")

class HabitCompletion(Base):
    __tablename__ = "habit_completions"
    
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    date = Column(DateTime, nullable=False, index=True)
    completed = Column(Boolean, default=True)
    notes = Column(String, nullable=True)
    
    # Relationships
    habit = relationship("Habit", back_populates="completions")
```

## Queries Comunes

```python
# Query con joins
records = db.query(ActivityRecord).join(ActivityRecord.activity).filter(
    Activity.category == "study"
).all()

# Query con agregación
from sqlalchemy import func

stats = db.query(
    Activity.category,
    func.sum(ActivityRecord.duration_seconds).label("total_duration")
).join(ActivityRecord).group_by(Activity.category).all()

# Query con fechas
from datetime import datetime, timedelta

week_ago = datetime.utcnow() - timedelta(days=7)
recent_records = db.query(ActivityRecord).filter(
    ActivityRecord.start_time >= week_ago
).all()

# Eager loading para evitar N+1
activities = db.query(Activity).options(
    joinedload(Activity.records)
).all()
```

## Índices

```python
# Índices simples
email = Column(String, index=True)

# Índices compuestos
from sqlalchemy import Index

__table_args__ = (
    Index('ix_user_category', 'user_id', 'category'),
)
```
