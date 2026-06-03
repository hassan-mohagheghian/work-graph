# ADR 002: Hexagonal Architecture

## Status

Accepted

## Context

Want to decouple business logic from frameworks (FastAPI, DB).

## Decision

Use Hexagonal/Ports & Adapters.  
Domain and application layers never depend on FastAPI or SQLAlchemy directly.

## Alternatives Considered

- Layered architecture → faster for small projects, less flexible

## Consequences

- Clear separation of concerns
- Testable domain
- Supports multiple adapters (DB, cache, AI)
