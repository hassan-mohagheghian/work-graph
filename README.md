# WorkGraph

**Connect goals, work, knowledge, and intelligence.**

WorkGraph is an AI-powered workspace that helps teams transform knowledge into execution.

Instead of managing projects, tasks, documents, and planning across multiple disconnected tools, WorkGraph brings them together into a single platform where goals, knowledge, and execution remain connected.

The long-term vision is:

```text
Goals
  ↓
Knowledge
  ↓
Roadmap
  ↓
Milestones
  ↓
Tasks
  ↓
Execution
```

---

## Current Status

WorkGraph is under active development.

### Implemented

- Authentication (signup, login, sessions)
- Organizations with membership management
- Projects with CRUD, member roles, and overview dashboard
- Roadmaps with status lifecycle (draft → active → completed → archived)
- Milestones with drag-and-drop reordering
- Tasks with Kanban board (drag-and-drop between To Do / In Progress / Done)
- Documents with file attachment management
- Multi-tenancy with org-level access control
- Role-based access control (Owner, Admin, Member)
- Backend: Modular monolith with DDD, CQRS, Hexagonal Architecture
- Frontend: Next.js App Router with React Query, Tailwind CSS, @dnd-kit
- PostgreSQL with per-module Alembic migrations
- Docker development environment
- CI pipeline

### In Progress

- AI Planning Workflows
- Knowledge-based task generation

### Planned

- Goal Extraction
- Roadmap Generation
- Milestone Generation
- Knowledge Search
- Goal Alignment Analysis

---

## Tech Stack

### Backend

- Python 3.14+
- FastAPI
- SQLAlchemy (async)
- Alembic
- PostgreSQL

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- @dnd-kit (drag and drop)
- React Query

### Infrastructure

- Docker
- Docker Compose

### Development Tools

- UV
- Pytest
- Ruff
- MyPy

---

## Architecture

WorkGraph is built as a **Modular Monolith** following:

- Domain-Driven Design (DDD)
- Hexagonal Architecture (Ports & Adapters)
- CQRS (Command Query Responsibility Segregation)

The architecture is designed to allow future extraction of domains into independent services when necessary.

### Modules

```text
apps/backend/src/modules/
  ├── identity/      # Auth, users, sessions
  ├── organization/  # Orgs, memberships, RBAC
  ├── project/       # Projects, project members
  ├── planning/      # Roadmaps, milestones
  ├── task/          # Tasks, status management
  └── knowledge/     # Documents, attachments
```

---

## Documentation

Project documentation:

```text
docs/product
docs/architecture
docs/diagrams
```

---

## Running Locally

### Prerequisites

- Python 3.14+
- UV
- Docker
- Docker Compose
- Node.js

---

### Start Infrastructure

Navigate to backend:

```bash
cd apps/backend
```

Run Postgresql Container:

```bash
docker compose up -d
```

---

### Backend Setup

Navigate to backend:

```bash
cd apps/backend
```

Install dependencies:

```bash
uv sync
```

Apply migrations:

```bash
alembic upgrade head
```

Run backend server:

```bash
uv run uvicorn src.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API Docs:

```text
http://localhost:8000/docs
```

---

### Frontend Setup

Navigate to frontend:

```bash
cd apps/frontend
```

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Database Migrations (Alembic)

WorkGraph uses module-based migrations.

Each bounded context manages its own migration lifecycle.

### Initialize migrations for a module

```bash
cd src/modules/{module_name}/infrastructure/
alembic init migrations
```

### Create a new migration

Run from backend root:

```bash
uv run alembic \
  -c src/modules/{module_name}/infrastructure/persistence/alembic.ini \
  revision --autogenerate \
  -m "create new migrations"
```

### Apply migrations

```bash
uv run alembic \
  -c src/modules/{module_name}/infrastructure/persistence/alembic.ini \
  upgrade head
```

---

## Running Tests

From backend directory:

```bash
cd apps/backend
uv run pytest --cov
```

---

## Why WorkGraph?

Most teams struggle with fragmented tools.

- Tasks live in one place
- Documents in another
- Decisions in chats
- Planning in separate systems

WorkGraph connects all of these into one graph where knowledge becomes execution.
