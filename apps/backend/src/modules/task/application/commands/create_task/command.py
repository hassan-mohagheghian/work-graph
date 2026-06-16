from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateTaskCommand:
    org_id: UUID
    project_id: UUID
    title: str
    description: str | None = None
