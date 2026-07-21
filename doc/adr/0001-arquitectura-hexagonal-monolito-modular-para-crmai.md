# ADR 1: Arquitectura Hexagonal + Monolito Modular para crmAI

**Status:** accepted

## Context

El sistema CRM requiere una arquitectura que permita 12 módulos (bounded contexts) independientes pero cohesivos, con capacidad futura de extraer módulos a microservicios. Se necesita separar reglas de negocio de infraestructura y permitir intercambiabilidad de integraciones externas (WhatsApp, SMS, pagos, LMS).

## Decision

Se adopta Arquitectura Hexagonal (Ports & Adapters) + Monolito Modular. Cada módulo sigue la estructura domain/ → application/ → infrastructure/ → interface/. La comunicación entre módulos solo ocurre a través de casos de uso públicos, nunca por repositorios internos. Los puertos (interfaces) definen las integraciones externas sin depender de implementaciones concretas.

## Alternatives

  - Clean Architecture pura (ya implementada en proyectos previos pero sin nombrar la capa de puertos explícitamente)
  - Microservicios desde el inicio (mayor complejidad operativa inicial, no justificada para v1)
  - Arquitectura por capas tradicional (acoplamiento alto entre módulos, difícil de escalar)
