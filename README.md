# WorkGraph

**Tagline:** Connect work, knowledge, and intelligence.

---

## Overview

WorkGraph is a multi-tenant project and knowledge management platform designed around Domain-Driven Design (DDD), Hexagonal Architecture, and CQRS principles.

The goal is to provide a unified workspace where teams can manage projects, documentation, and AI-assisted workflows through a single platform.

This repository follows a modular monolith approach, allowing future extraction of domains into independent services when required.

---

## Current Status

### Phase

MVP Foundation

### Implemented

- Project structure
- Architecture documentation
- ADRs
- Identity domain
- User management foundation
- PostgreSQL integration
- Docker development environment
- Alembic migration setup
- FastAPI application bootstrap

### In Progress

- Identity module

### Planned

- Organization management
- Membership management
- Authorization
- Project management
- Knowledge management
- AI integration
- Notifications

---

## Architecture

### Architectural Style

- Modular Monolith
- Domain-Driven Design (DDD)
- Hexagonal Architecture (Ports and Adapters)
- CQRS

### Architectural Decisions

#### ADR-000

Multi-Tenancy Strategy

Shared Database

Shared Schema

Tenant isolation through organization ownership.

#### ADR-001

Domain-Driven Design

Each domain owns its business rules, entities, use cases, and infrastructure.

#### ADR-002

Hexagonal Architecture

Business logic remains independent from frameworks, databases, and external systems.

---

## Domain Structure

Current bounded contexts:

- Identity
- Workspace
- Project
- Knowledge
- AI
- Notification

Current implementation focus:

- Identity

---

## Identity Domain

## Responsibilities

- User registration
- Authentication
- Organization management
- Membership management
- Authorization

## Core Entities

### User

Represents a platform user.

### Organization

Represents a tenant.

### Membership

Represents a user's participation within an organization.

## Roles

- Owner
- Admin
- Member

---

## Repository Structure

```text
workgraph/

├── apps/
│   ├── backend/
│   └── frontend/
│
├── docs/
│   ├── product/
│   ├── architecture/
│   │   ├── adr/
│   │   └── domains/
│   └── diagrams/
│
├── infrastructure/
│
├── tests/
│
├── .gitignore
└── README.md
```

---

## Backend Structure

```text
apps/backend/

├── src/
│
├── bootstrap/
│
├── config/
│
├── modules/
│   └── identity/
│
├── migrations/
│
├── pyproject.toml
└── README.md
```

---

## Development Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

### Frontend

- React
- TypeScript

### Infrastructure

- Docker
- Docker Compose

### Development Tools

- UV
- Ruff
- Pytest
- MyPy

---

## Database

### Engine

PostgreSQL

### Migration Tool

Alembic

### Strategy

Schema changes must be applied through migrations.

Direct database modifications are not allowed.

---

## Documentation

Project documentation is located in:

```text
docs/
```

### Product

Contains:

- Vision
- MVP definition
- Roadmap

### Architecture

Contains:

- Domain map
- ADRs
- Domain specifications
- Architecture decisions

### Diagrams

Contains:

- System diagrams
- Domain diagrams
- Context diagrams

---

## Running the Project

### Prerequisites

Install:

- Python 3.14+
- Docker
- Docker Compose
- UV

---

### Start PostgreSQL

```bash
docker compose up -d
```

---

### Install Dependencies

```bash
uv sync
```

---

### Apply Migrations

```bash
alembic upgrade head
```

---

### Run Backend

```bash
uv run uvicorn src.main:app --reload
```

---

### Verify

Application:

```text
http://localhost:8000
```

API Documentation:

```text
http://localhost:8000/docs
```

---

## Roadmap

### Phase 1

Identity

- Users
- Organizations
- Memberships
- Authentication

### Phase 2

Project Management

- Projects
- Sprints
- Tasks

### Phase 3

Knowledge Management

- Documents
- Pages
- Search

### Phase 4

AI

- RAG
- Semantic Search
- Assistant

### Phase 5

Platform

- Notifications
- Analytics
- Audit Logs

---

## Long-Term Goal

Build a production-grade SaaS platform demonstrating:

- Software Architecture
- Domain Modeling
- Distributed Systems Readiness
- Modern Python Engineering Practices
- Full-Stack Development Skills

Suitable as a senior-level portfolio project.
