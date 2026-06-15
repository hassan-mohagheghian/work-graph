from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity


@dataclass(eq=False)
class Project(Entity):
    org_id: UUID
    name: str
    description: str | None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
