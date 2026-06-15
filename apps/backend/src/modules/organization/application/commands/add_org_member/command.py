from dataclasses import dataclass
from uuid import UUID

from src.modules.organization.domain.value_objects.role import OrgRole


@dataclass
class AddOrgMemberCommand:
    email: str
    org_id: UUID
    role: OrgRole
