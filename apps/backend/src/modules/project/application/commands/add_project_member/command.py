from dataclasses import dataclass
from uuid import UUID


@dataclass
class AddProjectMemberCommand:
    project_id: UUID
    org_id: UUID
    user_id: UUID
    role: str = "member"
