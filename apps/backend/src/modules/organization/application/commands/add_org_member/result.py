from dataclasses import dataclass
from uuid import UUID

from src.modules.organization.domain.value_objects.role import OrgRole


@dataclass
class AddOrgMembershipResult:
    id: UUID
    user_id: UUID
    org_id: UUID
    role: OrgRole
