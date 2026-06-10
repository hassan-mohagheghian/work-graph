from datetime import datetime, timezone
from uuid import uuid4

import pytest
from src.modules.organization.application.commands.change_role.command import (
    ChangeOrgMemberRoleCommand,
)
from src.modules.organization.application.commands.change_role.handler import (
    ChangeOrgMemberRoleHandler,
)
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.entities.organization import Organization
from src.modules.organization.domain.value_objects.role import OrgRole


@pytest.mark.asyncio
async def test_change_role_success(org_repo, org_membership_repo):

    # --- setup org ---
    org = Organization(
        name="org-2",
        created_at=datetime.now(timezone.utc),
    )
    await org_repo.add(organization=org)

    # --- owner (actor) ---
    owner_id = uuid4()
    owner = OrgMembership(
        org_id=org.id,
        user_id=owner_id,
        role=OrgRole.OWNER,
        created_at=datetime.now(timezone.utc),
    )
    await org_membership_repo.add(owner)

    # --- target member ---
    member_id = uuid4()
    member = OrgMembership(
        org_id=org.id,
        user_id=member_id,
        role=OrgRole.MEMBER,
        created_at=datetime.now(timezone.utc),
    )
    await org_membership_repo.add(member)

    handler = ChangeOrgMemberRoleHandler(membership_repo=org_membership_repo)
    cmd = ChangeOrgMemberRoleCommand(
        org_id=org.id, target_user_id=member_id, new_role=OrgRole.ADMIN
    )

    result = await handler.handle(cmd=cmd, actor_membership=owner)

    assert result

    updated = await org_membership_repo.get_by_user_and_org(
        user_id=member_id, org_id=org.id
    )
    assert updated.role == OrgRole.ADMIN
