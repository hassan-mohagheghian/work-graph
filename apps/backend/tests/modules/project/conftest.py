import pytest
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)
from src.modules.project.infrastructure.persistence.sqla_project_membership_repo import (
    SQLAProjectMembershipRepo,
)


@pytest.fixture
async def project_membership_repo(async_session) -> ProjectMembershipRepo:
    return SQLAProjectMembershipRepo(session=async_session)
