from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Any
import httpx
import json

from app.core.database import get_db
from app.core.config import settings
from app.models.activity_record import ActivityRecord
from app.models.activity import Activity
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])

class OpenRouterService:
    """Service for interacting with OpenRouter API."""
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.OPENROUTER_MODEL
        self.base_url = settings.OPENROUTER_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.SITE_URL,
            "X-OpenRouter-Title": settings.SITE_NAME,
        }
    
    async def chat(
        self, 
        query: str, 
        context_data: List[Dict[str, Any]]
    ) -> ChatResponse:
        """Send query with activity context to LLM."""
        system_prompt = self._build_system_prompt()
        user_prompt = self._build_user_prompt(query, context_data)
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1000,
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()
        
        return ChatResponse(
            answer=data["choices"][0]["message"]["content"],
            sources=[],
            confidence=0.8
        )
    
    def _build_system_prompt(self) -> str:
        return """Eres un asistente de análisis de hábitos personales.
Tu trabajo es ayudar a los usuarios a entender sus patrones de actividad.

Reglas:
1. Basa tus respuestas ÚNICAMENTE en los datos proporcionados
2. Si no hay suficientes datos, dilo claramente
3. Proporciona insights accionables
4. Sé alentador pero realista
5. Usa formato markdown para mejor legibilidad
6. Responde en español

Ejemplo de respuesta:
"Esta semana estudiaste **12.5 horas**, un **20% más** que la semana anterior.
Tu mejor racha fue de **5 días consecutivos**."""
    
    def _build_user_prompt(
        self, 
        query: str, 
        context_data: List[Dict[str, Any]]
    ) -> str:
        context_json = json.dumps(context_data, indent=2, default=str)
        
        return f"""Contexto de mis actividades:
{context_json}

Pregunta: {query}

Responde en español de manera clara y concisa."""

llm_service = OpenRouterService()

@router.post("/", response_model=ChatResponse)
async def chat_with_habits(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat con contexto de actividades del usuario.
    
    El LLM recibe el histórico de actividades y responde preguntas.
    """
    context_window = timedelta(days=request.context_window)
    start_date = datetime.utcnow() - context_window
    
    records = db.query(ActivityRecord).filter(
        ActivityRecord.start_time >= start_date
    ).join(Activity).all()
    
    context_data = [
        {
            "activity_name": record.activity.name,
            "category": record.activity.category,
            "start_time": record.start_time.isoformat(),
            "duration_seconds": record.duration_seconds,
            "notes": record.notes
        }
        for record in records
    ]
    
    total_hours = sum(r.duration_seconds or 0 for r in records) / 3600
    context_data.append({
        "summary": {
            "total_hours": round(total_hours, 2),
            "total_sessions": len(records),
            "date_range": f"{start_date.date()} to {datetime.utcnow().date()}"
        }
    })
    
    try:
        response = await llm_service.chat(request.query, context_data)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar consulta: {str(e)}"
        )
