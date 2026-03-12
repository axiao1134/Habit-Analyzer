from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import activities, habits, activity_records, chat, reminders
from app.core.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Habit Analyzer API",
    description="API para tracking y análisis de hábitos personales",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(activities.router)
app.include_router(habits.router)
app.include_router(activity_records.router)
app.include_router(chat.router)
app.include_router(reminders.router)

@app.get("/")
async def root():
    return {
        "message": "Habit Analyzer API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
