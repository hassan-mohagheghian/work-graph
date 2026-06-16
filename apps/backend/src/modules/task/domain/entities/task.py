from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity


@dataclass(eq=False)
class Task(Entity):
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: str = "todo"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
