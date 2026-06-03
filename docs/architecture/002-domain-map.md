# Domain Map

## Bounded Contexts

```mermaid
graph TD

Identity

Workspace

Project

Knowledge

AI

Notification

Identity --> Workspace
Workspace --> Project
Workspace --> Knowledge

Project --> AI
Knowledge --> AI

Project --> Notification
```

## Domain Ownership

| Domain | Owns |
| ---------- | ---------- |
| Identity | User, Organization, Membership |
| Workspace | Team, Workspace |
| Project | Project, Sprint, Task |
| Knowledge | Document, Page |
| AI | ChatSession, Embedding |
| Notification | Notification, Delivery |
