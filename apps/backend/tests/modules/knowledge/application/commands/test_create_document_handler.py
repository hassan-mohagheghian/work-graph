from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest
from fastapi import HTTPException
from src.modules.knowledge.application.commands.create_document.command import (
    CreateDocumentCommand,
    DocumentLinkInput,
)
from src.modules.knowledge.application.commands.create_document.handler import (
    CreateDocumentHandler,
)
from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType
from src.modules.organization.domain.value_objects.role import OrgRole


@pytest.fixture
def document_repo():
    return AsyncMock()


@pytest.fixture
def project_repo():
    return AsyncMock()


@pytest.fixture
def task_repo():
    return AsyncMock()


@pytest.fixture
def org_membership_facade():
    facade = AsyncMock()
    facade.get_user_role = AsyncMock(return_value=OrgRole.MEMBER)
    return facade


@pytest.fixture
def rbac():
    rbac = MagicMock()
    rbac.assert_can_create = MagicMock()
    return rbac


@pytest.mark.asyncio
async def test_create_document_requires_links(
    document_repo, project_repo, task_repo, org_membership_facade, rbac
):
    handler = CreateDocumentHandler(
        document_repo, project_repo, task_repo, org_membership_facade, rbac
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(
            CreateDocumentCommand(
                org_id=uuid4(),
                user_id=uuid4(),
                title="Spec",
                description="Details",
                links=[],
            )
        )

    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_create_document_validates_project_link(
    document_repo, project_repo, task_repo, org_membership_facade, rbac
):
    org_id = uuid4()
    project_id = uuid4()
    project_repo.get_by_id.return_value = None

    handler = CreateDocumentHandler(
        document_repo, project_repo, task_repo, org_membership_facade, rbac
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(
            CreateDocumentCommand(
                org_id=org_id,
                user_id=uuid4(),
                title="Spec",
                description=None,
                links=[
                    DocumentLinkInput(
                        target_type=LinkTargetType.project,
                        target_id=project_id,
                    )
                ],
            )
        )

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_create_document_success(
    document_repo, project_repo, task_repo, org_membership_facade, rbac
):
    org_id = uuid4()
    project_id = uuid4()
    project_repo.get_by_id.return_value = MagicMock(org_id=org_id)
    document_repo.create = AsyncMock()

    handler = CreateDocumentHandler(
        document_repo, project_repo, task_repo, org_membership_facade, rbac
    )

    result = await handler.handle(
        CreateDocumentCommand(
            org_id=org_id,
            user_id=uuid4(),
            title="Product spec",
            description="Goals and requirements",
            links=[
                DocumentLinkInput(
                    target_type=LinkTargetType.project,
                    target_id=project_id,
                )
            ],
        )
    )

    assert result.title == "Product spec"
    assert len(result.links) == 1
    document_repo.create.assert_awaited_once()
