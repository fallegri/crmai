# ADR 3: Estructura de 10 slices para entrega incremental del CRM

**Status:** accepted

## Context

El sistema CRM crmAI requiere una entrega estructurada en módulos independientes pero integrados. Cada slice representa un bounded context con su propio ciclo SDD completo.

## Decision

Se entrega el sistema en 10 slices incrementales: (1) Scaffolding, (2) Auth+RBAC, (3) Catálogo, (4) Contactos+Oportunidades, (5) Actividades, (6) Agenda, (7) Automatizaciones, (8) Campañas, (9) Reportes, (10) Documentos+Notificaciones. Cada slice sigue el ciclo SDD: specify → requirements → contract → plan → tasks → implement.

## Alternatives

  - Entrega Big Bang (mayor riesgo, sin validación incremental)
  - Microservicios desde inicio (mayor complejidad operativa)
