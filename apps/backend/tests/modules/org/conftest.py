import pytest
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)
from src.modules.organization.infrastructure.persistence.sqlalchemy_membership_repo import (
    SQLAlchemyOrgMembershipRepo,
)
from src.modules.organization.infrastructure.persistence.sqlalchemy_organization_repository import (
    SQLAlchemyOrganizationRepository,
)


@pytest.fixture
async def org_repo(async_session) -> OrganizationRepository:
    return SQLAlchemyOrganizationRepository(session=async_session)


@pytest.fixture
async def org_membership_repo(async_session) -> OrgMembershipRepo:
    return SQLAlchemyOrgMembershipRepo(session=async_session)
