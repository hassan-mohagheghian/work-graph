from fastapi import HTTPException, status
from src.modules.organization.application.commands.change_role.command import (
    ChangeOrgMemberRoleCommand,
)
from src.modules.organization.application.policies.membership_policy import (
    MembershipPolicy,
)
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole


class ChangeOrgMemberRoleHandler:
    def __init__(self, membership_repo: OrgMembershipRepo):
        self.membership_repo = membership_repo

    async def handle(self, cmd: ChangeOrgMemberRoleCommand, actor_membership) -> bool:
        policy = MembershipPolicy(actor_membership)

        if not policy.can_change_role():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only OWNER can change roles",
            )

        target = await self.membership_repo.get_by_user_and_org(
            user_id=cmd.target_user_id, org_id=cmd.org_id
        )

        if not target:
            raise HTTPException(
                status_code=404,
                detail="Member not found",
            )

        # 3. LAST OWNER PROTECTION
        if target.role == OrgRole.OWNER and cmd.new_role != OrgRole.OWNER:
            owner_count = await self.membership_repo.count_owners(org_id=cmd.org_id)

            if owner_count <= 1:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot demote last owner",
                )

        await self.membership_repo.update_role(
            org_id=cmd.org_id,
            user_id=cmd.target_user_id,
            role=cmd.new_role,
        )

        return True
