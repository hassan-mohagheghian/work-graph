import uuid
from datetime import datetime, timezone

import pytest
from src.modules.organization.application.queries.get_org.get_org_handler import (
    GetOrgHandler,
)
from src.modules.organization.application.queries.get_org.get_org_query import (
    GetOrgQuery,
)
from src.modules.organization.application.queries.get_org.get_org_response import (
    GetOrgResponse,
)
from src.modules.organization.domain.exceptions import OrganizationNotFoundError
from src.modules.organization.domain.identities.organization import Organization


@pytest.mark.asyncio
async def test_get_organization_success(async_session, org_repo):
    # -------------------------
    # Arrange: create organization
    # -------------------------
    org = Organization(
        id=uuid.uuid4(),
        name="Acme Corp",
        owner_id=uuid.uuid4(),
        created_at=datetime.now(timezone.utc),
    )
    await org_repo.add(org)

    handler = GetOrgHandler(repo=org_repo)

    query = GetOrgQuery(org_id=org.id)

    # -------------------------
    # Act: get organization
    # -------------------------
    result: GetOrgResponse = await handler.handle(query)

    # -------------------------
    # Assert: returned data
    # -------------------------
    assert result.id == str(org.id)
    assert result.name == org.name
    assert result.owner_id == str(org.owner_id)


@pytest.mark.asyncio
async def test_get_organization_not_found(async_session, org_repo):
    # -------------------------
    # Arrange: query for non-existent org
    # -------------------------
    handler = GetOrgHandler(repo=org_repo)
    query = GetOrgQuery(org_id=uuid.uuid4())

    # -------------------------
    # Act & Assert: expect exception
    # -------------------------

    with pytest.raises(OrganizationNotFoundError):
        await handler.handle(query)
