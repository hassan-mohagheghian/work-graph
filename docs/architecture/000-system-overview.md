# System Overview

## Architecture Style

Modular Monolith with Domain-Driven Design, Hexagonal Architecture, and CQRS.

Designed for future extraction of domains into independent services.

## High-Level Structure

```text
apps/
├── backend/           # FastAPI + SQLAlchemy
│   └── src/
│       ├── modules/   # Bounded contexts
│       │   ├── identity/
│       │   ├── organization/
│       │   ├── project/
│       │   ├── planning/
│       │   ├── task/
│       │   └── knowledge/
│       ├── shared/    # Cross-cutting concerns
│       └── bootstrap/ # App initialization
│
└── frontend/          # Next.js App Router
    └── src/
        ├── app/       # Routes and layouts
        ├── features/  # Feature modules (API, hooks, components)
        └── shared/    # UI components, utils, context
```

## Module Structure (Backend)

Each module follows hexagonal architecture:

```text
module/
├── domain/
│   ├── entities/      # Business objects
│   ├── value_objects/ # Immutable types
│   └── repos/        # Repository interfaces (ports)
├── application/
│   ├── commands/      # Write operations (CQRS)
│   └── queries/       # Read operations (CQRS)
└── infrastructure/
    ├── persistence/   # SQLAlchemy models, repo implementations
    └── api/           # FastAPI routers
```

## Data Flow

### Write (Command)
```
API Router → Command Handler → Repository → Database
```

### Read (Query)
```
API Router → Query Handler → Repository → Database
```

## Multi-Tenancy

All data is scoped to organizations via `org_id` foreign keys.

Row-level security enforced at repository layer.

## Key Decisions

- See `docs/adr/` for architectural decision records
- Per-module database schemas for isolation
- Async SQLAlchemy for performance
- FastAPI `Depends` for dependency injection (no global container)
