# Changelog

## 2026-07-21
### crmAI-system [feature]
- **Iteration:** v1.0-iter-1
- **Approved by:** Fernando Allegri
- **Comment:** Scaffolding completo del monorepo + Módulo Identity con Auth (JWT + refresh tokens), RBAC server-side, PermissionsGuard, OwnershipScope, 2FA opcional, rate limiting. Arquitectura Hexagonal implementada: domain/ → application/ → infrastructure/ → interface/.

## 2026-07-21
### catalog [feature]
- **Iteration:** v1.0-iter-2
- **Approved by:** Fernando Allegri
- **Comment:** Módulo Catalog completo: Facultades, Programas, Cohorts con CRUD, cache Redis, arquitectura hexagonal. Endpoints públicos (solo lectura) y admin (protegidos con JWT + PermissionsGuard).

## 2026-07-21
### contacts [feature]
- **Iteration:** v1.0-iter-3
- **Approved by:** Fernando Allegri
- **Comment:** Módulo Contacts+Opportunities completo: Contactos deduplicados (R2), Pipeline de etapas configurables, Oportunidades por Program/Cohort, Asignación round-robin (R4), Enrollment manual auditado (R3). Arquitectura hexagonal con puertos de deduplicación y asignación.

## 2026-07-21
### crmAI-system [feature]
- **Iteration:** v1.0-iter-4
- **Approved by:** Fernando Allegri
- **Comment:** Slices 5-10 completados: Activities (timeline cursor-based), Agenda (calendario), Automations (reglas trigger-acción), Campaigns, Reporting (funnel, conversión, ranking), Documents + Notifications (in-app). Sistema completo con 10 módulos y arquitectura hexagonal.

## 2026-07-21
### crmAI-system [feature]
- **Iteration:** v1.0-final
- **Approved by:** Fernando Allegri
- **Comment:** Ciclo SDD completo para los 10 módulos del CRM: Identity, Catalog, Contacts, Activities, Agenda, Automations, Campaigns, Reporting, Documents, Notifications. Cada módulo procesado con dev-assistant: specify → requirements → contract → plan → task → implement.

