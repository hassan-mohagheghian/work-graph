from dataclasses import dataclass
from uuid import UUID


@dataclass(slots=True)
class ProjectMemberResult:
    id: UUID
    user_id: UUID
    project_id: UUID
    role: str
