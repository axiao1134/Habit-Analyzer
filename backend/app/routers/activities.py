from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.activity import Activity
from app.schemas import ActivityCreate, ActivityUpdate, ActivityResponse

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.get("/", response_model=List[ActivityResponse])
async def list_activities(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List all activities with pagination."""
    activities = db.query(Activity).offset(skip).limit(limit).all()
    return activities

@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific activity by ID."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
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
    activity = Activity(**activity_data.model_dump(), user_id=1)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing activity."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    update_data = activity_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)
    
    db.commit()
    db.refresh(activity)
    return activity

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Delete an activity."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    db.delete(activity)
    db.commit()
