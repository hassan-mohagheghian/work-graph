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
from src.modules.organization.domain.value_objects.role import OrgRole


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

        target_membership = await self.org_membership_repo.get_by_user_and_org(
            user_id=cmd.target_user_id, org_id=cmd.org_id
        )

        if not target_membership:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found",
            )

        if target_membership.role == OrgRole.OWNER:
            owner_count = await self.org_membership_repo.count_owners(org_id=cmd.org_id)

            if owner_count <= 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot remove last owner",
                )

        await self.org_membership_repo.delete(
            org_id=cmd.org_id, user_id=cmd.target_user_id
        )

        return True
