---
name: pytest-backend
description: Escribe tests para backend con pytest
license: MIT
compatibility: opencode
metadata:
  audience: testers
  category: testing
---

# Skill: Pytest Backend

## Propósito

Escribir tests automatizados para backend con pytest y FastAPI TestClient.

## Cuándo Usar

- Tests de endpoints
- Tests de servicios
- Tests de modelos

## Configuración

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models import User, Activity

# Database de test en memoria
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": True},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Crear tablas antes de los tests
@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# Override dependency
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture
def test_user(db_session):
    user = User(
        email="test@example.com",
        hashed_password="hashed_password"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_activity(db_session, test_user):
    activity = Activity(
        name="Estudiar",
        category="study",
        user_id=test_user.id
    )
    db_session.add(activity)
    db_session.commit()
    db_session.refresh(activity)
    return activity
```

## Tests de Endpoints

```python
# tests/test_activities.py
import pytest
from fastapi import status
from datetime import datetime

class TestActivityEndpoints:
    """Tests para endpoints de actividades."""
    
    def test_list_activities_empty(self, client):
        """Debe retornar lista vacía cuando no hay actividades."""
        response = client.get("/api/activities")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    def test_list_activities_with_data(self, client, test_activity):
        """Debe retornar lista con actividades."""
        response = client.get("/api/activities")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Estudiar"
        assert data[0]["category"] == "study"
    
    def test_get_activity_by_id(self, client, test_activity):
        """Debe obtener actividad por ID."""
        response = client.get(f"/api/activities/{test_activity.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_activity.id
        assert data["name"] == "Estudiar"
    
    def test_get_activity_not_found(self, client):
        """Debe retornar 404 cuando actividad no existe."""
        response = client.get("/api/activities/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Activity not found"
    
    def test_create_activity(self, client):
        """Debe crear nueva actividad."""
        activity_data = {
            "name": "Programar",
            "category": "work",
            "description": "Desarrollo de software"
        }
        
        response = client.post("/api/activities", json=activity_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Programar"
        assert data["category"] == "work"
        assert "id" in data
    
    def test_create_activity_invalid_name(self, client):
        """Debe validar nombre de actividad."""
        activity_data = {
            "name": "",  # Nombre vacío
            "category": "work"
        }
        
        response = client.post("/api/activities", json=activity_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_update_activity(self, client, test_activity):
        """Debe actualizar actividad existente."""
        update_data = {
            "name": "Estudiar Python",
            "category": "study"
        }
        
        response = client.put(f"/api/activities/{test_activity.id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Estudiar Python"
    
    def test_delete_activity(self, client, test_activity):
        """Debe eliminar actividad."""
        response = client.delete(f"/api/activities/{test_activity.id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verificar que fue eliminada
        get_response = client.get(f"/api/activities/{test_activity.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
```

## Tests Parametrizados

```python
# tests/test_validations.py
import pytest
from fastapi import status

@pytest.mark.parametrize("name,expected_status", [
    ("Estudiar", status.HTTP_201_CREATED),
    ("Programar", status.HTTP_201_CREATED),
    ("", status.HTTP_422_UNPROCESSABLE_ENTITY),
    ("A" * 101, status.HTTP_422_UNPROCESSABLE_ENTITY),  # Más de 100 caracteres
])
def test_create_activity_name_validation(self, client, name, expected_status):
    """Validación de nombre de actividad."""
    activity_data = {"name": name, "category": "study"}
    response = client.post("/api/activities", json=activity_data)
    assert response.status_code == expected_status

@pytest.mark.parametrize("category,expected_status", [
    ("study", status.HTTP_201_CREATED),
    ("work", status.HTTP_201_CREATED),
    ("invalid_category", status.HTTP_422_UNPROCESSABLE_ENTITY),
    ("STUDY", status.HTTP_422_UNPROCESSABLE_ENTITY),  # Debe ser minúscula
])
def test_create_activity_category_validation(self, client, category, expected_status):
    """Validación de categoría."""
    activity_data = {"name": "Test", "category": category}
    response = client.post("/api/activities", json=activity_data)
    assert response.status_code == expected_status
```

## Tests de Servicios

```python
# tests/test_services.py
import pytest
from datetime import datetime, timedelta

from app.services.activity_service import activity_service
from app.models import ActivityRecord

class TestActivityService:
    """Tests para service layer."""
    
    def test_get_all_pagination(self, db_session, test_user):
        """Test de paginación."""
        # Crear 25 actividades
        for i in range(25):
            activity = Activity(name=f"Activity {i}", user_id=test_user.id)
            db_session.add(activity)
        db_session.commit()
        
        # Obtener primera página
        activities = activity_service.get_all(db_session, skip=0, limit=10)
        assert len(activities) == 10
        
        # Obtener segunda página
        activities = activity_service.get_all(db_session, skip=10, limit=10)
        assert len(activities) == 10
    
    def test_create_activity_record(self, db_session, test_activity):
        """Test de creación de registro."""
        record_data = {
            "activity_id": test_activity.id,
            "start_time": datetime.utcnow(),
            "end_time": datetime.utcnow() + timedelta(hours=1),
            "duration_seconds": 3600
        }
        
        record = activity_service.create_record(db_session, record_data)
        
        assert record.id is not None
        assert record.duration_seconds == 3600
```

## Ejecución de Tests

```bash
# Correr todos los tests
pytest

# Con coverage
pytest --cov=app --cov-report=html

# Tests específicos
pytest tests/test_activities.py -v

# Con output detallado
pytest -s -v
```
