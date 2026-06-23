from dataclasses import dataclass
from uuid import UUID


@dataclass
class UpdateProjectMemberRoleCommand:
    project_id: UUID
    user_id: UUID
    role: str
