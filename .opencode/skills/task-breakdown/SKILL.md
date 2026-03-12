---
name: task-breakdown
description: Descompone features en tareas técnicas implementables
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: planning
---

# Skill: Task Breakdown

## Propósito

Descomponer features complejos en tareas técnicas pequeñas y estimables.

## Cuándo Usar

- Sprint planning
- Antes de implementar features
- Para estimación de esfuerzo

## Proceso de Descomposición

### Nivel 1: Epic
Feature grande (semanas de trabajo)
Ej: "Sistema de tracking de hábitos"

### Nivel 2: Story
Historia de usuario (días de trabajo)
Ej: "Como usuario, quiero registrar tiempo de estudio"

### Nivel 3: Task
Tarea técnica (horas de trabajo)
Ej: "Crear modelo Activity en SQLAlchemy"

### Nivel 4: Subtask
Unidad mínima (1-2 horas)
Ej: "Definir campos del modelo"

## Criterios de Descomposición

Una tarea está bien descompuesta cuando:
- ✅ Se puede completar en < 8 horas
- ✅ Es independiente de otras tareas
- ✅ Es estimable
- ✅ Es testeable
- ✅ Tiene valor entregable

## Template de Task

```markdown
## Task: [Nombre]

**ID**: TASK-001
**Epic**: [Nombre del Epic]
**Story**: [Nombre de la Story]

### Descripción
[Qué se va a hacer]

### Criterios de Done
- [ ] Código implementado
- [ ] Tests escritos
- [ ] Documentación actualizada
- [ ] Code review aprobado

### Dependencias
- [ ] TASK-002 (bloqueante)
- [ ] TASK-003 (relacionada)

### Estimación
- Complejidad: Baja/Media/Alta
- Puntos: 1/2/3/5/8/13
- Horas: X horas

### Recursos
- [Link a docs relevantes]
- [Archivos a modificar]
```

## Ejemplo para Habit Analyzer

```markdown
## Epic: Sistema de Temporalizador

### Story 1: Iniciar timer
**Tasks**:
- [ ] TASK-001: Crear endpoint POST /api/timer/start (3 pts)
- [ ] TASK-002: Crear componente Timer en frontend (3 pts)
- [ ] TASK-003: Implementar estado local del timer (2 pts)
- [ ] TASK-004: Integrar timer con backend (2 pts)

### Story 2: Detener timer
**Tasks**:
- [ ] TASK-005: Crear endpoint POST /api/timer/stop (2 pts)
- [ ] TASK-006: Guardar registro en database (2 pts)
- [ ] TASK-007: Actualizar UI al detener (1 pt)
```
