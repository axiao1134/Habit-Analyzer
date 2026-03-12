---
name: openrouter-integration
description: Integra API de OpenRouter para LLM
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers
  category: implementation
---

# Skill: OpenRouter Integration

## Propósito

Integrar la API de OpenRouter para consultas contextuales sobre actividades.

## Cuándo Usar

- Consultas sobre histórico de actividades
- Análisis de patrones de hábitos
- Generación de insights

## Configuración

```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str = "qwen/qwen-2.5-72b-instruct"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # Site attribution (opcional, para rankings)
    SITE_URL: str = "http://localhost:5173"
    SITE_NAME: str = "Habit Analyzer"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## Cliente OpenRouter

```python
# app/services/llm_service.py
import httpx
import json
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.core.config import settings
from app.schemas import ChatRequest, ChatResponse

class OpenRouterService:
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
        """
        Envía query con contexto de actividades al LLM.
        
        Args:
            query: Pregunta del usuario
            context_data: Lista de actividades/hábitos como contexto
        
        Returns:
            ChatResponse con la respuesta del LLM
        """
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
            sources=self._extract_sources(context_data),
            confidence=0.8  # Podría calcularse basado en la respuesta
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
    
    def _extract_sources(self, context_data: List[Dict[str, Any]]) -> List[str]:
        sources = []
        for item in context_data:
            if "activity_name" in item:
                sources.append(f"Actividad: {item['activity_name']}")
        return sources

llm_service = OpenRouterService()
```

## Endpoint de Chat

```python
# app/routers/chat.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.core.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services import llm_service
from app.models import ActivityRecord, Activity

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat_with_habits(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat con contexto de actividades del usuario.
    
    El LLM recibe el histórico de actividades y responde preguntas.
    """
    # Obtener contexto de la base de datos
    context_window = timedelta(days=request.context_window)
    start_date = datetime.utcnow() - context_window
    
    # Obtener registros de actividades
    records = db.query(ActivityRecord).filter(
        ActivityRecord.start_time >= start_date
    ).join(Activity).all()
    
    # Convertir a formato para el LLM
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
    
    # Agregar estadísticas resumidas
    total_hours = sum(r.duration_seconds or 0 for r in records) / 3600
    context_data.append({
        "summary": {
            "total_hours": round(total_hours, 2),
            "total_sessions": len(records),
            "date_range": f"{start_date.date()} to {datetime.utcnow().date()}"
        }
    })
    
    # Llamar al LLM
    try:
        response = await llm_service.chat(request.query, context_data)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar consulta: {str(e)}"
        )
```

## Modelos Recomendados

| Modelo | Precio | Contexto | Uso |
|--------|--------|----------|-----|
| qwen/qwen-2.5-72b-instruct | $0.00038/1k | 32k | General |
| deepseek/deepseek-chat:free | Gratis | 128k | Testing |
| nvidia/nemotron-3:free | Gratis | 1M | Contexto largo |
