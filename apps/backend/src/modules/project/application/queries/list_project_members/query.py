from dataclasses import dataclass
from uuid import UUID


@dataclass(slots=True)
class ListProjectMembersQuery:
    project_id: UUID
