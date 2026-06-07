import uuid
from datetime import datetime, timezone

import pytest
from src.modules.organization.application.queries.list_by_owner.list_by_owner_handler import (
    ListOrganizationsByOwnerHandler,
)
from src.modules.organization.application.queries.list_by_owner.list_by_owner_query import (
    ListOrganizationsByOwnerQuery,
)
from src.modules.organization.domain.identities.organization import Organization


@pytest.mark.asyncio
async def test_list_organizations_by_owner(async_session, org_repo):
    # -------------------------
    # Arrange
    # -------------------------
    owner_id = uuid.uuid4()

    org1 = Organization(
        id=uuid.uuid4(),
        name="Org 1",
        owner_id=owner_id,
        created_at=datetime.now(timezone.utc),
    )

    org2 = Organization(
        id=uuid.uuid4(),
        name="Org 2",
        owner_id=owner_id,
        created_at=datetime.now(timezone.utc),
    )

    # Different owner org (should NOT be returned)
    other_org = Organization(
        id=uuid.uuid4(),
        name="Other Org",
        owner_id=uuid.uuid4(),
        created_at=datetime.now(timezone.utc),
    )

    await org_repo.add(org1)
    await org_repo.add(org2)
    await org_repo.add(other_org)

    handler = ListOrganizationsByOwnerHandler(repo=org_repo)

    query = ListOrganizationsByOwnerQuery(owner_id=owner_id)

    # -------------------------
    # Act
    # -------------------------
    result = await handler.handle(query)

    # -------------------------
    # Assert
    # -------------------------
    returned_ids = {org.id for org in result.organizations}

    assert len(result.organizations) == 2
    assert str(org1.id) in returned_ids
    assert str(org2.id) in returned_ids
    assert str(other_org.id) not in returned_ids
