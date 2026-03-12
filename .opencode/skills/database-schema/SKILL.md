---
name: database-schema
description: Diseña esquemas de base de datos relacionales y NoSQL
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: architecture
---

# Skill: Database Schema Design

## Propósito

Diseñar esquemas de base de datos normalizados y eficientes.

## Cuándo Usar

- Diseño inicial de database
- Nuevas features que requieren modelos
- Optimización de queries

## Principios de Diseño

### 1. Normalización
- 1NF: Atributos atómicos
- 2NF: Sin dependencias parciales
- 3NF: Sin dependencias transitivas

### 2. Índices
- Primary keys siempre
- Foreign keys para joins
- Columnas usadas en WHERE

### 3. Relaciones
- One-to-Many: Foreign key en tabla hija
- Many-to-Many: Tabla intermedia
- One-to-One: Foreign key única

## Template SQLAlchemy

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    activities = relationship("Activity", back_populates="user")
    habits = relationship("Habit", back_populates="user")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, default="general")
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="activities")
    records = relationship("ActivityRecord", back_populates="activity")

class ActivityRecord(Base):
    __tablename__ = "activity_records"
    
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    duration_seconds = Column(Integer)
    notes = Column(String)
    
    activity = relationship("Activity", back_populates="records")

class Habit(Base):
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_days = Column(String)  # "MTWTFSS"
    streak = Column(Integer, default=0)
    
    user = relationship("User", back_populates="habits")
```

## Template Schema

```markdown
# Database Schema

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    User     │       │   Activity  │
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ user_id (FK)│
│ email       │       │ id (PK)     │
│ password    │       │ name        │
└─────────────┘       └─────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌─────────────┐
                       │ActivityRecord│
                       ├─────────────┤
                       │ id (PK)     │
                       │ activity_id │
                       │ start_time  │
                       │ duration    │
                       └─────────────┘
```

## Tablas

### users
| Columna | Tipo | Constraints |
|---------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| email | VARCHAR | UNIQUE, NOT NULL |
| password | VARCHAR | NOT NULL |

### activities
| Columna | Tipo | Constraints |
|---------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| name | VARCHAR | NOT NULL |
| user_id | INTEGER | FOREIGN KEY |

## Índices
- users.email (UNIQUE)
- activities.user_id
- activity_records.activity_id

## Migraciones
[Script de migración]
```
