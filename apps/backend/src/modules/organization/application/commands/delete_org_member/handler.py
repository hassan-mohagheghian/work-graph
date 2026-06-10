from fastapi import HTTPException, status
from src.modules.organization.application.commands.delete_org_member.command import (
    DeleteOrgMemberCommand,
)
from src.modules.organization.application.policies.membership_policy import (
    MembershipPolicy,
)
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)


class DeleteOrgMemberHandler:
    def __init__(self, org_membership_repo: OrgMembershipRepo):
        self.org_membership_repo = org_membership_repo

    async def handle(
        self, cmd: DeleteOrgMemberCommand, actor_membership: OrgMembership
    ) -> bool:
        policy = MembershipPolicy(membership=actor_membership)

        if not policy.can_delete_members():
            if not policy.can_manage_members():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only OWNER can remove members",
                )

        await self.org_membership_repo.delete(
            org_id=cmd.org_id, user_id=cmd.target_user_id
        )

        return True
