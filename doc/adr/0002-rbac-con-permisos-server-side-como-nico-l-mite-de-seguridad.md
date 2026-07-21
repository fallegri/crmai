# ADR 2: RBAC con permisos server-side como único límite de seguridad

**Status:** accepted

## Context

El sistema requiere control de acceso por roles y permisos. El frontend necesita ocultar elementos de UI según permisos, pero la seguridad real debe estar siempre en el backend para prevenir IDOR y accesos no autorizados.

## Decision

Se implementa RBAC server-side con PermissionsGuard y OwnershipScope en NestJS como único límite de seguridad real. El frontend (usePermission) es solo UX. El scope server-side se sprea siempre al final para prevenir object-spray attacks. Roles por tupla (módulo, acción) con matriz editable por Admin.

## Alternatives

  - RBAC solo en frontend (inseguro - cualquier request modificado puede eludir controles)
  - ABAC (Attribute-Based Access Control - más flexible pero más complejo de implementar en v1)
  - Casbin (biblioteca externa de autorización - dependencia adicional no necesaria para el alcance actual)
