---
name: fastapi-crud
description: Implementa operaciones CRUD con FastAPI
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers
  category: implementation
---

# Skill: FastAPI CRUD

## Propósito

Implementar operaciones CRUD completas con FastAPI de manera consistente.

## Cuándo Usar

- Crear nuevos recursos
- API endpoints estándar
- Operaciones básicas de datos

## Estructura Base

### Router Template

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas import ActivityCreate, ActivityUpdate, ActivityResponse
from app.services import activity_service

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.get("/", response_model=List[ActivityResponse])
async def list_activities(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List all activities with pagination."""
    activities = activity_service.get_all(db, skip=skip, limit=limit)
    return activities

@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific activity by ID."""
    activity = activity_service.get_by_id(db, activity_id)
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    return activity

@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db)
):
    """Create a new activity."""
    return activity_service.create(db, activity_data)

@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing activity."""
    activity = activity_service.update(db, activity_id, activity_data)
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    return activity

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Delete an activity."""
    success = activity_service.delete(db, activity_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
```

### Service Layer Template

```python
from sqlalchemy.orm import Session
from typing import List, Optional

from app.models import Activity
from app.schemas import ActivityCreate, ActivityUpdate

class ActivityService:
    def get_all(self, db: Session, skip: int = 0, limit: int = 20) -> List[Activity]:
        return db.query(Activity).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, activity_id: int) -> Optional[Activity]:
        return db.query(Activity).filter(Activity.id == activity_id).first()
    
    def create(self, db: Session, activity_data: ActivityCreate) -> Activity:
        activity = Activity(**activity_data.model_dump())
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
    
    def update(
        self, 
        db: Session, 
        activity_id: int, 
        activity_data: ActivityUpdate
    ) -> Optional[Activity]:
        activity = self.get_by_id(db, activity_id)
        if not activity:
            return None
        
        update_data = activity_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(activity, field, value)
        
        db.commit()
        db.refresh(activity)
        return activity
    
    def delete(self, db: Session, activity_id: int) -> bool:
        activity = self.get_by_id(db, activity_id)
        if not activity:
            return False
        
        db.delete(activity)
        db.commit()
        return True

activity_service = ActivityService()
```

## Mejores Prácticas

1. **Validación**: Usar Pydantic schemas
2. **Errores**: HTTPException con códigos apropiados
3. **Dependencias**: Inyectar DB session
4. **Tags**: Organizar endpoints en Swagger
5. **Response Models**: Definir schemas de salida
