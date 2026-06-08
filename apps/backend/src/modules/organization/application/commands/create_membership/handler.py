from datetime import datetime, timezone

from src.modules.organization.application.commands.create_membership.command import (
    CreateMembershipCommand,
)
from src.modules.organization.application.commands.create_membership.result import (
    CreateMembershipResult,
)
from src.modules.organization.domain.entities import OrgMembership
from src.modules.organization.domain.exceptions import OrgMembershipALreadyExistsError
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole


class CreateOrgMembershipHandler:
    def __init__(self, repo: OrgMembershipRepo):
        self.repo = repo

    async def handle(self, cmd: CreateMembershipCommand) -> CreateMembershipResult:
        existing = await self.repo.get_by_user_and_org(
            org_id=cmd.org_id, user_id=cmd.user_id
        )
        if existing:
            raise OrgMembershipALreadyExistsError(
                f"Organization membership with user {CreateMembershipCommand.user_id} already exits."
            )
        membership = OrgMembership(
            org_id=cmd.org_id,
            user_id=cmd.user_id,
            role=OrgRole(cmd.role),
            created_at=datetime.now(timezone.utc),
        )

        await self.repo.add(membership=membership)
        return CreateMembershipResult(
            id=membership.id,
            user_id=membership.user_id,
            org_id=membership.org_id,
            role=membership.role.name,
            created_at=membership.created_at,
        )
