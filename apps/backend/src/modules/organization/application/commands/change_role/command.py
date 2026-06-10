from dataclasses import dataclass

from src.modules.organization.domain.value_objects.role import OrgRole


@dataclass
class ChangeOrgMemberRoleCommand:
    org_id: str
    target_user_id: str
    new_role: OrgRole
