from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import ReminderRequest

router = APIRouter(prefix="/api/reminders", tags=["reminders"])

@router.post("/send-habit-reminder")
async def send_habit_reminder(
    request: ReminderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Envía recordatorio de hábito en background."""
    
    # TODO: Implement email service
    # For now, just return success
    return {
        "message": "Reminder queued",
        "habit_id": request.habit_id,
        "scheduled_time": request.scheduled_time
    }
