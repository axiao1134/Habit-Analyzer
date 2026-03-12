---
name: user-story-mapping
description: Crea user stories y mapea journey del usuario
license: MIT
compatibility: opencode
metadata:
  audience: product-managers
  category: planning
---

# Skill: User Story Mapping

## Propósito

Crear historias de usuario claras y mapear el journey completo del usuario.

## Cuándo Usar

- Planning de sprints
- Diseño de features
- Refinamiento de backlog

## Formato de User Story

```
Como [rol de usuario],
Quiero [objetivo/acción],
Para [beneficio/valor].

Criterios de Aceptación:
- [ ] Dado [contexto] Cuando [acción] Entonces [resultado]
- [ ] Dado [contexto] Cuando [acción] Entonces [resultado]
```

## User Story Map

### Backbone (Actividades Principales)
1. Registro de usuario
2. Tracking de hábitos
3. Visualización de progreso
4. Configuración de recordatorios

### Walking Skeleton (MVP)
Las historias mínimas para entregar valor:
- Usuario puede registrar una actividad
- Usuario puede ver tiempo total

### Releases
**Release 1 (MVP)**
- Registro básico de actividades
- Timer simple

**Release 2**
- Gráficos de progreso
- Historial

**Release 3**
- Recordatorios por email
- Predicción de consistencia

## Journey Map

```
[Descubrimiento] → [Registro] → [Primer Uso] → [Hábito] → [Lealtad]
     ↓                ↓            ↓           ↓          ↓
  Marketing      Onboarding    Tutorial    Retención   Advocacy
```

## Template

```markdown
## User Stories

### Feature: [Nombre]

#### Historia 1
**Como**: [rol]
**Quiero**: [objetivo]
**Para**: [beneficio]

**Criterios**:
- [ ] Given-When-Then 1
- [ ] Given-When-Then 2

#### Historia 2
...

## Journey Map
[Diagrama del journey]

## Priorización (MoSCoW)
- Must have: ...
- Should have: ...
- Could have: ...
- Won't have: ...
```
