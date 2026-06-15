from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateProjectCommand:
    org_id: UUID
    name: str
    description: str | None = None
