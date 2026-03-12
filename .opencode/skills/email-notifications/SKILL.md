---
name: email-notifications
description: Envía recordatorios por email con SMTP
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers
  category: implementation
---

# Skill: Email Notifications

## Propósito

Enviar recordatorios y notificaciones por email usando SMTP.

## Cuándo Usar

- Recordatorios de hábitos
- Resúmenes semanales
- Notificaciones de logros

## Configuración

```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str = "Habit Analyzer"
    SMTP_TLS: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## Servicio de Email

```python
# app/services/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from datetime import datetime

from app.core.config import settings

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL
        self.from_name = settings.SMTP_FROM_NAME
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Envía un email HTML.
        
        Args:
            to_email: Destinatario
            subject: Asunto del email
            html_content: Contenido HTML
            text_content: Contenido texto plano (opcional)
        
        Returns:
            True si se envió exitosamente
        """
        try:
            # Crear mensaje
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            # Contenido texto plano
            if text_content:
                text_part = MIMEText(text_content, 'plain', 'utf-8')
                msg.attach(text_part)
            
            # Contenido HTML
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Conectar y enviar
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if settings.SMTP_TLS:
                    server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def send_habit_reminder(
        self,
        to_email: str,
        habit_name: str,
        scheduled_time: str
    ) -> bool:
        """Envía recordatorio de hábito."""
        subject = f"⏰ Recordatorio: {habit_name}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 20px; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .button {{ display: inline-block; padding: 12px 24px; 
                          background-color: #667eea; color: white; 
                          text-decoration: none; border-radius: 5px; }}
                .footer {{ padding: 20px; text-align: center; color: #888; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Recordatorio de Hábito</h1>
                </div>
                <div class="content">
                    <h2>¡Hola!</h2>
                    <p>Es hora de tu hábito: <strong>{habit_name}</strong></p>
                    <p>Programado para: {scheduled_time}</p>
                    <p>¡Mantén tu racha y sigue así! 💪</p>
                    <p>
                        <a href="http://localhost:5173" class="button">
                            Registrar Ahora
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>Habit Analyzer - Tu compañero de productividad</p>
                    <p><small>Para desactivar recordatorios, visita tu configuración</small></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(to_email, subject, html_content)
    
    def send_weekly_summary(
        self,
        to_email: str,
        week_stats: dict
    ) -> bool:
        """Envía resumen semanal."""
        subject = f"📊 Tu Resumen Semanal - {week_stats['week_start']} al {week_stats['week_end']}"
        
        activities_html = "".join([
            f"""<tr>
                <td>{stat['category'].capitalize()}</td>
                <td>{stat['hours']:.1f}h</td>
                <td>{stat['sessions']} sesiones</td>
            </tr>"""
            for stat in week_stats.get('activities', [])
        ])
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                          color: white; padding: 20px; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #f1f5f9; }}
                .stat-box {{ background: white; padding: 15px; border-radius: 8px; 
                           margin: 10px 0; text-align: center; }}
                .stat-number {{ font-size: 2em; font-weight: bold; color: #10b981; }}
                .footer {{ padding: 20px; text-align: center; color: #888; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📈 Resumen Semanal</h1>
                </div>
                <div class="content">
                    <h2>¡Gran trabajo esta semana!</h2>
                    
                    <div style="display: flex; gap: 10px;">
                        <div class="stat-box" style="flex: 1;">
                            <div class="stat-number">{week_stats.get('total_hours', 0):.1f}</div>
                            <div>Horas Totales</div>
                        </div>
                        <div class="stat-box" style="flex: 1;">
                            <div class="stat-number">{week_stats.get('consistency', 0):.0f}%</div>
                            <div>Consistencia</div>
                        </div>
                        <div class="stat-box" style="flex: 1;">
                            <div class="stat-number">{week_stats.get('streak', 0)}</div>
                            <div>Racha Actual</div>
                        </div>
                    </div>
                    
                    <h3>Actividades por Categoría</h3>
                    <table>
                        <tr>
                            <th>Categoría</th>
                            <th>Tiempo</th>
                            <th>Sesiones</th>
                        </tr>
                        {activities_html}
                    </table>
                    
                    <p style="margin-top: 20px;">
                        {week_stats.get('message', '¡Sigue así!')}
                    </p>
                </div>
                <div class="footer">
                    <p>Habit Analyzer - Tu compañero de productividad</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(to_email, subject, html_content)

email_service = EmailService()
```

## Background Task

```python
# app/routers/reminders.py
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import User, Habit
from app.services.email_service import email_service
from app.schemas import ReminderRequest

router = APIRouter(prefix="/api/reminders", tags=["reminders"])

@router.post("/send-habit-reminder")
async def send_habit_reminder(
    request: ReminderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Envía recordatorio de hábito en background."""
    
    def send_reminder_task(user_email: str, habit_name: str, time: str):
        email_service.send_habit_reminder(user_email, habit_name, time)
    
    # Obtener usuario y hábito
    user = db.query(User).filter(User.id == request.user_id).first()
    habit = db.query(Habit).filter(Habit.id == request.habit_id).first()
    
    if user and habit:
        background_tasks.add_task(
            send_reminder_task,
            user.email,
            habit.name,
            request.scheduled_time
        )
    
    return {"message": "Reminder queued"}
```

## Variables de Entorno

```bash
# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=app_password_generada
SMTP_FROM_EMAIL=tu_email@gmail.com
SMTP_FROM_NAME=Habit Analyzer
SMTP_TLS=true
```
