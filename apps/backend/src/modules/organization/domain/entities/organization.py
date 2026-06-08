import uuid
from datetime import datetime, timezone

from src.modules.shared.domain.entity import Entity


class Organization(Entity):
    def __init__(
        self,
        name: str,
        id: uuid.UUID | None = None,
        created_at: datetime | None = None,
    ):
        super().__init__(id=id)
        if not name:
            raise ValueError("Organization name must be at least 1 characters")
        self.name = name
        self.created_at: datetime = created_at or datetime.now(timezone.utc)
