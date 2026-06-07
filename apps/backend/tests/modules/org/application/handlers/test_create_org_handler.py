from datetime import datetime
from uuid import uuid4

import pytest
from src.modules.organization.application.commands.create_org_handler import (
    CreateOrgHandler,
)
from src.modules.organization.infrastructure.persistence.sqlalchemy_organization_repository import (
    SQLAlchemyOrganizationRepository,
)


@pytest.mark.asyncio
async def test_create_organization(async_session):
    """
    Test that CreateOrganizationHandler can persist a new organization.
    """

    # -------------------------
    # Arrange: repository and handler
    # -------------------------
    org_repo = SQLAlchemyOrganizationRepository(session=async_session)
    handler = CreateOrgHandler(org_repo=org_repo)

    org_name = "Acme Corp"
    owner_id = uuid4()

    # -------------------------
    # Act: create organization
    # -------------------------
    org = await handler.handle(name=org_name, owner_id=owner_id)

    # -------------------------
    # Assert: verify persisted entity
    # -------------------------
    assert org.id is not None
    assert org.name == org_name
    assert isinstance(org.created_at, datetime)

    # Verify in DB
    db_org = await org_repo.get_by_name(org.name)
    assert db_org is not None
    assert db_org.name == org_name
