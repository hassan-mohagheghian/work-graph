from dataclasses import dataclass
from uuid import UUID


@dataclass
class RemoveProjectMemberCommand:
    project_id: UUID
    user_id: UUID
