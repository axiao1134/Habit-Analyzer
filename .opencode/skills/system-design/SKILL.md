---
name: system-design
description: Diseña arquitectura de sistemas escalables y mantenibles
license: MIT
compatibility: opencode
metadata:
  audience: architects
  category: architecture
---

# Skill: System Design

## Propósito

Diseñar arquitectura de sistemas software con patrones probados.

## Cuándo Usar

- Inicio de proyecto
- Rediseño de sistema existente
- Features que requieren arquitectura nueva

## Componentes del Diseño

### 1. Diagrama de Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │ ───► │   Backend    │ ───► │  Database   │
│   (React)   │ ◄─── │  (FastAPI)   │ ◄─── │  (SQLite)   │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  OpenRouter  │
                     │     API      │
                     └──────────────┘
```

### 2. Patrones de Diseño

**Backend**:
- Repository Pattern para acceso a datos
- Service Layer para lógica de negocio
- Dependency Injection para testing

**Frontend**:
- Container/Presentational Pattern
- Custom Hooks para lógica reutilizable
- Context API para estado global

### 3. Capas del Sistema

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Components, Pages, Routes)      │
├─────────────────────────────────────┤
│         Application Layer           │
│     (Services, Business Logic)      │
├─────────────────────────────────────┤
│           Domain Layer              │
│       (Entities, Interfaces)        │
├─────────────────────────────────────┤
│        Infrastructure Layer         │
│    (Database, External APIs)        │
└─────────────────────────────────────┘
```

### 4. Decisiones de Arquitectura

| Decisión | Opción | Rationale |
|----------|--------|-----------|
| API Style | REST | Simple, estándar, buen soporte |
| Auth | JWT | Stateless, escalable |
| DB | SQLite | Simple, sin configuración |

## Template

```markdown
# System Design Document

## Overview
[Descripción del sistema]

## Architecture Diagram
[Diagrama]

## Components

### Component 1: [Nombre]
**Responsabilidad**: [Qué hace]
**Interfaz**: [Cómo se comunica]
**Tecnología**: [Stack]

### Component 2: [Nombre]
...

## Data Flow
1. [Paso 1]
2. [Paso 2]

## Scalability Considerations
- [Consideración 1]
- [Consideración 2]

## Security Considerations
- [Consideración 1]
- [Consideración 2]
```
