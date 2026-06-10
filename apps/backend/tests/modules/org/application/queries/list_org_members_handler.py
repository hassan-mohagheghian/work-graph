import pytest
from src.modules.organization.application.queries.list_membership_by_org.handler import (
    ListOrgMembersHandler,
)
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.models import (
    OrganizationModel,
    OrgMembershipModel,
)
from src.modules.organization.infrastructure.persistence.sqlalchemy_membership_repo import (
    SQLAlchemyOrgMembershipRepo,
)


@pytest.mark.asyncio
async def test_list_org_members(async_session):
    repo = SQLAlchemyOrgMembershipRepo(async_session)

    org = OrganizationModel(name="test-org")
    async_session.add(org)

    member1 = OrgMembershipModel(
        org_id=org.id,
        user_id="u1",
        role=OrgRole.OWNER,
    )

    member2 = OrgMembershipModel(
        org_id=org.id,
        user_id="u2",
        role=OrgRole.MEMBER,
    )

    async_session.add_all([member1, member2])
    await async_session.commit()

    handler = ListOrgMembersHandler(repo)

    result = await handler.handle(org.id)

    assert len(result) == 2
    assert {m.user_id for m in result} == {"u1", "u2"}
