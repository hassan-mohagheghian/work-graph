from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateMembershipCommand:
    org_id: UUID
    user_id: UUID
    role: str
