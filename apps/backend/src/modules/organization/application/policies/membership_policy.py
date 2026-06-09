from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.value_objects.role import OrgRole


class MembershipPolicy:
    def __init__(self, membership: OrgMembership | None):
        self.membership = membership

    def can_add_member(self) -> bool:
        if not self.membership:
            return False
        return self.membership.role == OrgRole.OWNER

    def can_remove_member(self) -> bool:
        if not self.membership:
            return False
        return self.membership.role == OrgRole.OWNER
