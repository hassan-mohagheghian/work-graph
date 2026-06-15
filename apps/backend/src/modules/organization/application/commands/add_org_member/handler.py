from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from src.modules.identity.domain.repositories.user_repository import UserRepository
from src.modules.organization.application.commands.add_org_member.command import (
    AddOrgMemberCommand,
)
from src.modules.organization.application.commands.add_org_member.result import (
    AddOrgMembershipResult,
)
from src.modules.organization.application.policies.membership_policy import (
    MembershipPolicy,
)
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole


class AddOrgMemberHandler:
    def __init__(
        self, org_membership_repo: OrgMembershipRepo, user_repo: UserRepository
    ):
        self.org_membership_repo = org_membership_repo
        self.user_repo = user_repo

    async def handle(
        self, cmd: AddOrgMemberCommand, current_user_membership: OrgMembership
    ):
        policy = MembershipPolicy(membership=current_user_membership)

        if not policy.can_add_member():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not allowed to add members",
            )

        user = await self.user_repo.get_by_email(email=cmd.email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        membership = OrgMembership(
            org_id=cmd.org_id,
            user_id=user.id,
            role=OrgRole(cmd.role),
            created_at=datetime.now(timezone.utc),
        )

        try:
            await self.org_membership_repo.add(membership=membership)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)

        return AddOrgMembershipResult(
            id=membership.id,
            user_id=membership.user_id,
            org_id=membership.org_id,
            role=membership.role,
        )
