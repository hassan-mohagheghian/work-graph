from dataclasses import dataclass
from uuid import UUID

from src.modules.organization.domain.value_objects.role import OrgRole


@dataclass
class OrgMemberItem:
    user_id: UUID
    name: str
    email: str
    role: OrgRole


@dataclass
class OrgMembersResponse:
    members: list[OrgMemberItem]
