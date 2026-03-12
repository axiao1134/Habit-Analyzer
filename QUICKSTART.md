# 🚀 Habit Analyzer - Guía de Inicio Rápido

## Prerequisites

- Python 3.11+
- Node.js 18+

## Instalación

### 1. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Activar entorno (Linux/Mac)
# source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar variables de entorno
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Editar .env con tus credenciales
# - OPENROUTER_API_KEY: Ya está configurada
# - SMTP_*: Configura tu email para recordatorios
```

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

## Ejecución

### Terminal 1 - Backend

```bash
cd backend
venv\Scripts\activate  # Si no está activado
uvicorn app.main:app --reload
```

El backend se ejecutará en http://localhost:8000

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

El frontend se ejecutará en http://localhost:5173

## Uso

1. **Dashboard** - Vista general de tu progreso
2. **Timer** - Inicia el temporalizador para trackear actividades
3. **Actividades** - Gestiona actividades predefinidas y personalizadas
4. **Hábitos** - Crea y sigue hábitos recurrentes
5. **Chat** - Pregúntale al LLM sobre tus actividades

## Actividades Predefinidas

- 😴 Dormir
- 💪 Ejercicio
- 📖 Estudiar
- 💻 Programar

## Chat con LLM

El chat usa OpenRouter con el modelo `qwen/qwen-2.5-72b-instruct` (económico y potente).

Preguntas de ejemplo:
- "¿Cuántas horas estudié esta semana?"
- "¿Cuál es mi actividad más frecuente?"
- "¿Cómo ha sido mi consistencia este mes?"

## Configuración de Email (Opcional)

Para recibir recordatorios:

1. Ve a https://myaccount.google.com/apppasswords
2. Genera una contraseña de aplicación
3. Actualiza tu `.env` en el backend:

```env
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password
```

## Estructura de Agentes

El proyecto usa 6 agentes de OpenCode:

| Agente | Propósito | Modelo |
|--------|-----------|--------|
| Planner | Requisitos técnicos | qwen-2.5-72b |
| Architect | Diseño de arquitectura | qwen-2.5-72b |
| Backend | API FastAPI | qwen-2.5-72b |
| Frontend | UI React | qwen-2.5-72b |
| Tester | Tests automatizados | qwen-2.5-72b |
| Documentation | Documentación | qwen-2.5-72b |

## Skills Disponibles

El proyecto incluye 15 skills especializados:

- `requirements-analysis` - Análisis de requisitos
- `user-story-mapping` - Historias de usuario
- `task-breakdown` - Descomposición de tareas
- `system-design` - Diseño de sistemas
- `database-schema` - Esquemas de BD
- `api-design` - Diseño de APIs
- `fastapi-crud` - CRUD con FastAPI
- `sqlalchemy-orm` - ORM SQLAlchemy
- `pydantic-validation` - Validación Pydantic
- `openrouter-integration` - Integración LLM
- `react-components` - Componentes React
- `hooks-pattern` - Custom Hooks
- `chartjs-integration` - Gráficos Chart.js
- `pytest-backend` - Tests backend
- `email-notifications` - Emails SMTP

## Troubleshooting

### Error: Module not found

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Error: Database locked

Elimina el archivo de database y reinicia:

```bash
rm backend/habits.db
```

### Error: CORS

Asegúrate que el backend tenga CORS configurado para el puerto del frontend.

## Siguientes Pasos

1. ✅ El proyecto está creado
2. ⏳ Instalar dependencias
3. ⏳ Configurar variables de entorno
4. ⏳ Ejecutar backend y frontend
5. ⏳ ¡Comienza a trackear tus hábitos!
