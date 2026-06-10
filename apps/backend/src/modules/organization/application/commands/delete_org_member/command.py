from dataclasses import dataclass
from uuid import UUID


@dataclass
class DeleteOrgMemberCommand:
    org_id: UUID
    target_user_id: UUID
