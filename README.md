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

- Authentication
- Organizations
- Memberships
- Projects
- Tasks
- Multi-tenancy foundation
- Backend architecture
- Frontend foundation
- PostgreSQL integration
- Docker development environment
- CI pipeline

### In Progress

- Knowledge Management (Documents)
- AI Planning Workflows

### Planned

- Goal Extraction
- Roadmap Generation
- Milestone Generation
- Task Generation
- Knowledge Search
- Goal Alignment Analysis

---

## Tech Stack

### Backend

- Python 3.14+
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

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
- Hexagonal Architecture
- CQRS

The architecture is designed to allow future extraction of domains into independent services when necessary.

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

---

## Project Status

WorkGraph is evolving toward a goal-driven workflow where AI transforms organizational knowledge into:

- Goals
- Roadmaps
- Milestones
- Tasks

See `docs/product/v2` for the latest direction.
