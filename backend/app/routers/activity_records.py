from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.models.activity_record import ActivityRecord
from app.models.activity import Activity
from app.schemas import ActivityRecordCreate, ActivityRecordResponse

router = APIRouter(prefix="/api/activity-records", tags=["activity-records"])

@router.get("/", response_model=List[ActivityRecordResponse])
async def list_records(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List all activity records."""
    records = db.query(ActivityRecord).offset(skip).limit(limit).all()
    return records

@router.get("/{record_id}", response_model=ActivityRecordResponse)
async def get_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific record by ID."""
    record = db.query(ActivityRecord).filter(ActivityRecord.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    return record

@router.post("/", response_model=ActivityRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_record(
    record_data: ActivityRecordCreate,
    db: Session = Depends(get_db)
):
    """Create a new activity record."""
    activity = db.query(Activity).filter(Activity.id == record_data.activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    record = ActivityRecord(**record_data.model_dump(), user_id=1)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    """Delete an activity record."""
    record = db.query(ActivityRecord).filter(ActivityRecord.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found"
        )
    
    db.delete(record)
    db.commit()

@router.get("/activity/{activity_id}", response_model=List[ActivityRecordResponse])
async def get_records_by_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """Get all records for a specific activity."""
    records = db.query(ActivityRecord).filter(
        ActivityRecord.activity_id == activity_id
    ).all()
    return records
