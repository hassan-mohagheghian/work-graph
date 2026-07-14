# WorkGraph

**Connect goals, work, knowledge, and intelligence.**

WorkGraph is an AI-powered workspace that helps teams transform knowledge into execution.

Instead of managing projects, tasks, documents, and planning across multiple disconnected tools, WorkGraph brings them together into a single platform where goals, knowledge, and execution remain connected.

## Vision

```text
Goals → Knowledge → Roadmap → Milestones → Tasks → Execution
```

Users provide documents (requirements, specs, meeting notes), AI assesses them, and generates roadmaps, milestones, and tasks automatically.

---

## Current Status (v2.0)

### Implemented

**Core Platform**
- Authentication (signup, login, sessions)
- Organizations with membership management
- Projects with CRUD, member roles, and overview dashboard
- Multi-tenancy with org-level access control
- Role-based access control (Owner, Admin, Member)

**Planning**
- Roadmaps with status lifecycle (draft → active → completed → archived)
- Milestones with drag-and-drop reordering
- Tasks with Kanban board (drag-and-drop between To Do / In Progress / Done)

**Knowledge**
- Documents with file attachment management
- Document-level attachments (upload, download, delete)

**Frontend**
- Header with searchable org/project dropdowns and submenu navigation
- Org tabs (Overview, Projects, Members, Settings)
- Project tabs (Overview, Documents, Roadmap, Tasks, Members, Settings)
- Unified button patterns across all tabs
- Bottom-sheet drawers for create/edit forms
- Toast notifications (Sonner)
- Breadcrumbs for navigation

**Backend**
- Modular monolith with DDD, CQRS, Hexagonal Architecture
- PostgreSQL with per-module Alembic migrations
- Docker development environment

### Next Phase: AI Planning

The next phase focuses on the knowledge-to-execution loop:

1. **Phase A** - Review Generated Assets (generated asset models, review UI)
2. **Phase B** - AI Extraction Contract (JSON schemas, validation)
3. **Phase C** - AI Planning MVP (generate roadmaps/milestones/tasks from docs)
4. **Phase D** - Apply Reviewed Assets (convert accepted items to real tasks)
5. **Phase E** - Evaluation and Iteration (quality scoring, prompt tuning)

See [docs/product/v2/005-next-phases-ai-planning.md](docs/product/v2/005-next-phases-ai-planning.md) for details.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.14+, FastAPI, SQLAlchemy (async), Alembic, PostgreSQL |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| State | React Query (Tanstack) |
| Infra | Docker, Docker Compose |
| Dev Tools | UV, Pytest, Ruff, MyPy |

---

## Architecture

**Modular Monolith** with Domain-Driven Design, Hexagonal Architecture, and CQRS.

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

## Running Locally

### Prerequisites

- Python 3.14+, UV, Docker, Docker Compose, Node.js

### Start Infrastructure

```bash
cd apps/backend
docker compose up -d
```

### Backend Setup

```bash
cd apps/backend
uv sync
alembic upgrade head
uv run uvicorn src.main:app --reload
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd apps/frontend
npm install
npm run dev
```

- App: http://localhost:3000

---

## Database Migrations

Each module manages its own Alembic migrations:

```bash
# Create migration
uv run alembic \
  -c src/modules/{module}/infrastructure/persistence/alembic.ini \
  revision --autogenerate -m "description"

# Apply migrations
uv run alembic \
  -c src/modules/{module}/infrastructure/persistence/alembic.ini \
  upgrade head
```

---

## Testing

```bash
cd apps/backend
uv run pytest --cov
```

---

## Documentation

```text
docs/
├── product/         # Vision, MVP, roadmap, phases
├── architecture/    # System design, domain models, ADRs
├── ux/              # Flows, screens, states, design system
└── diagrams/        # System context diagrams
```
