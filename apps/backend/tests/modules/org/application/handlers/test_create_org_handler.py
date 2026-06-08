import uuid

import pytest
from src.modules.organization.application.commands.create_org.command import (
    CreateOrgCommand,
)
from src.modules.organization.application.commands.create_org.handler import (
    CreateOrgHandler,
)
from src.modules.organization.domain.value_objects.role import OrgRole


@pytest.mark.asyncio
async def test_create_org_creates_owner_membership(org_repo, org_membership_repo):
    # -------------------------
    # Arrange
    # -------------------------
    handler = CreateOrgHandler(
        org_repo=org_repo, org_membership_repo=org_membership_repo
    )

    owner_id = uuid.uuid4()

    cmd = CreateOrgCommand(
        name="Acme Corp",
        owner_id=owner_id,
    )

    # -------------------------
    # Act
    # -------------------------
    result = await handler.handle(cmd)

    # -------------------------
    # Assert: organization created
    # -------------------------
    org = await org_repo.get_by_id(result.id)
    assert org is not None
    assert org.name == "Acme Corp"

    # -------------------------
    # Assert: membership created
    # -------------------------
    memberships = await org_membership_repo.list_by_org(result.id)

    assert len(memberships) == 1

    membership = memberships[0]

    assert membership.user_id == owner_id
    assert membership.org_id == result.id
    assert membership.role == OrgRole.OWNER
