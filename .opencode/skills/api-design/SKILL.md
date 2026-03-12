---
name: api-design
description: Diseña APIs RESTful con mejores prácticas
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: architecture
---

# Skill: API Design

## Propósito

Diseñar APIs RESTful consistentes y bien documentadas.

## Cuándo Usar

- Creación de nuevos endpoints
- Refactorización de API existente
- Integración con otros sistemas

## Principios REST

### 1. Recursos como Sustantivos
✅ `/api/activities`
❌ `/api/getActivities`

### 2. Métodos HTTP Correctos
| Método | Operación | Idempotente |
|--------|-----------|-------------|
| GET | Leer | Sí |
| POST | Crear | No |
| PUT | Reemplazar | Sí |
| PATCH | Actualizar | Sí |
| DELETE | Eliminar | Sí |

### 3. Códigos de Estado
| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## Template de Endpoints

```markdown
# API Reference

## Activities

### List Activities
```
GET /api/activities
```

**Query Parameters**:
| Nombre | Tipo | Descripción |
|--------|------|-------------|
| limit | int | Máximo resultados (default: 20) |
| offset | int | Paginación (default: 0) |
| category | string | Filtrar por categoría |

**Response 200**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Estudiar",
      "category": "productivity",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

### Create Activity
```
POST /api/activities
```

**Request Body**:
```json
{
  "name": "Programar",
  "category": "work"
}
```

**Response 201**:
```json
{
  "id": 2,
  "name": "Programar",
  "category": "work",
  "created_at": "2024-01-02T00:00:00Z"
}
```

### Get Activity
```
GET /api/activities/{id}
```

**Response 200**:
```json
{
  "id": 2,
  "name": "Programar",
  "category": "work"
}
```

**Response 404**:
```json
{
  "detail": "Activity not found"
}
```

### Update Activity
```
PUT /api/activities/{id}
```

**Request Body**:
```json
{
  "name": "Programar en Python",
  "category": "work"
}
```

### Delete Activity
```
DELETE /api/activities/{id}
```

**Response 204**: No content
```

## Versionado

```
/api/v1/activities
/api/v2/activities
```

## Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```
