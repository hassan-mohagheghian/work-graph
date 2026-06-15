from datetime import datetime, timezone

import pytest
from src.modules.identity.domain.entities.user import User
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.modules.organization.application.commands.add_org_member.command import (
    AddOrgMemberCommand,
)
from src.modules.organization.application.commands.add_org_member.handler import (
    AddOrgMemberHandler,
)
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.entities.organization import Organization
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.sqlalchemy_membership_repo import (
    SQLAlchemyOrgMembershipRepo,
)
from src.modules.organization.infrastructure.persistence.sqlalchemy_organization_repository import (
    SQLAlchemyOrganizationRepository,
)


@pytest.mark.asyncio
async def test_add_member_integration(async_session):
    # ---------- repos ----------
    membership_repo = SQLAlchemyOrgMembershipRepo(async_session)
    user_repo = SQLAlchemyUserRepository(async_session)
    org_repo = SQLAlchemyOrganizationRepository(async_session)

    # ---------- seed data ----------
    org = Organization(
        name="org",
        created_at=datetime.now(timezone.utc),
    )
    await org_repo.add(org)

    user = User.create(
        email="user@test.com",
        display_name="user1",
        password_hash="x",
    )
    await user_repo.add(user)
    owner = User.create(
        email="owner@test.com",
        display_name="owner",
        password_hash="x",
    )
    await user_repo.add(owner)

    # owner membership
    owner_membership = OrgMembership(
        org_id=org.id,
        user_id=owner.id,
        role=OrgRole.OWNER,
        created_at=datetime.now(timezone.utc),
    )

    await membership_repo.add(owner_membership)

    # ---------- handler ----------
    handler = AddOrgMemberHandler(
        org_membership_repo=membership_repo,
        user_repo=user_repo,
    )

    cmd = AddOrgMemberCommand(
        org_id=org.id,
        email=user.email,
        role=OrgRole.MEMBER,
    )

    result = await handler.handle(cmd, owner_membership)

    # ---------- assertions ----------
    assert result.user_id == user.id
    assert result.org_id == org.id
    assert result.role == OrgRole.MEMBER
