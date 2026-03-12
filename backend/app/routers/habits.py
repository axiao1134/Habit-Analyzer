from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.habit import Habit, HabitCompletion
from app.schemas import HabitCreate, HabitResponse, HabitCompletionResponse

router = APIRouter(prefix="/api/habits", tags=["habits"])

@router.get("/", response_model=List[HabitResponse])
async def list_habits(
    db: Session = Depends(get_db)
):
    """List all habits."""
    habits = db.query(Habit).all()
    return habits

@router.get("/{habit_id}", response_model=HabitResponse)
async def get_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific habit by ID."""
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    return habit

@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit_data: HabitCreate,
    db: Session = Depends(get_db)
):
    """Create a new habit."""
    habit = Habit(**habit_data.model_dump(), user_id=1)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit

@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    """Delete a habit."""
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    db.delete(habit)
    db.commit()

@router.post("/{habit_id}/completions", response_model=HabitCompletionResponse)
async def complete_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    """Mark a habit as completed for today."""
    from datetime import datetime
    
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    completion = HabitCompletion(habit_id=habit_id, date=today)
    db.add(completion)
    
    habit.streak += 1
    if habit.streak > habit.best_streak:
        habit.best_streak = habit.streak
    
    db.commit()
    db.refresh(completion)
    return completion
