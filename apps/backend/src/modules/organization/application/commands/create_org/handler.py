from datetime import datetime, timezone

from src.modules.organization.application.commands.create_org.command import (
    CreateOrgCommand,
)
from src.modules.organization.application.commands.create_org.result import (
    CreateOrgResult,
)
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.entities.organization import Organization
from src.modules.organization.domain.exceptions import OrganizationAlreadyExistsError
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)
from src.modules.organization.domain.value_objects.role import OrgRole


class CreateOrgHandler:
    def __init__(
        self,
        org_repo: OrganizationRepository,
        org_membership_repo: OrgMembershipRepo,
    ):
        self.org_repo = org_repo
        self.org_membership_repo = org_membership_repo

    async def handle(self, cmd: CreateOrgCommand) -> Organization:
        existing = await self.org_repo.get_by_name(cmd.name)
        if existing:
            raise OrganizationAlreadyExistsError(
                f"Organization {cmd.name} already exits."
            )
        org = Organization(name=cmd.name)
        await self.org_repo.add(organization=org)

        membership = OrgMembership(
            org_id=org.id,
            user_id=cmd.owner_id,
            role=OrgRole.OWNER,
            created_at=datetime.now(timezone.utc),
        )

        await self.org_membership_repo.add(membership=membership)

        return CreateOrgResult(id=org.id)
