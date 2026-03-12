---
name: requirements-analysis
description: Analiza y documenta requisitos funcionales y no funcionales
license: MIT
compatibility: opencode
metadata:
  audience: developers
  category: planning
---

# Skill: Requirements Analysis

## Propósito

Analizar requisitos de features y convertirlos en especificaciones técnicas claras.

## Cuándo Usar

- Nuevos features
- Cambios significativos
- Clarificación de requisitos ambiguos

## Proceso

### 1. Identificar Stakeholders
- Usuarios finales
- Administradores
- Sistemas externos

### 2. Requisitos Funcionales
Lista de lo que el sistema DEBE hacer:
- RF-001: El sistema debe permitir registrar actividades
- RF-002: El sistema debe mostrar gráficos de progreso

### 3. Requisitos No Funcionales
Lista de propiedades del sistema:
- RNF-001: Tiempo de respuesta < 200ms
- RNF-002: Soportar 1000 usuarios concurrentes
- RNF-003: Datos encriptados en tránsito

### 4. Criterios de Aceptación
Condiciones para considerar el feature completo:
- [ ] El usuario puede crear una actividad
- [ ] La actividad se guarda en la database
- [ ] Se valida que el nombre no esté vacío

### 5. Dependencias
- Externas: APIs de terceros
- Internas: Otros features del sistema

### 6. Restricciones
- Técnicas: Tecnologías obligatorias
- De negocio: Reglas que deben seguirse

## Output Template

```markdown
## Requisitos Funcionales
| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-001 | ... | Alta |

## Requisitos No Funcionales
| ID | Descripción | Métrica |
|----|-------------|---------|
| RNF-001 | ... | < 200ms |

## Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## Dependencias
- Dependencia 1

## Restricciones
- Restricción 1
```
