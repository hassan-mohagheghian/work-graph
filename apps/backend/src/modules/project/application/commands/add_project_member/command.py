from dataclasses import dataclass
from uuid import UUID


@dataclass
class AddProjectMemberCommand:
    project_id: UUID
    org_id: UUID
    email: UUID
    role: str = "member"
