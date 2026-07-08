from dataclasses import dataclass
from uuid import UUID


@dataclass
class UpdateProjectCommand:
    project_id: UUID
    org_id: UUID
    name: str | None = None
    description: str | None = None
