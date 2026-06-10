from fastapi import HTTPException, status
from src.modules.organization.application.commands.change_role.command import (
    ChangeOrgMemberRoleCommand,
)
from src.modules.organization.application.policies.membership_policy import (
    MembershipPolicy,
)


class ChangeOrgMemberRoleHandler:
    def __init__(self, membership_repo):
        self.membership_repo = membership_repo

    async def handle(self, cmd: ChangeOrgMemberRoleCommand, actor_membership) -> bool:
        policy = MembershipPolicy(actor_membership)

        if not policy.can_change_role():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only OWNER can change roles",
            )

        await self.membership_repo.update_role(
            org_id=cmd.org_id,
            user_id=cmd.target_user_id,
            role=cmd.new_role,
        )

        return True
