from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.task.application.commands.delete_task.command import DeleteTaskCommand
from src.modules.task.application.commands.delete_task.handler import DeleteTaskHandler


@pytest.fixture
def task_repo():
    return AsyncMock()


@pytest.fixture
def org_membership_facade():
    facade = AsyncMock()
    facade.get_user_role = AsyncMock(return_value=OrgRole.ADMIN)
    return facade


@pytest.fixture
def rbac():
    rbac = MagicMock()
    rbac.assert_can_delete = MagicMock()
    return rbac


class FakeTask:
    def __init__(self):
        self.id = "task-1"
        self.org_id = "org-1"


def cmd():
    return DeleteTaskCommand(
        task_id="task-1",
        org_id="org-1",
        user_id="user-1",
    )


@pytest.mark.asyncio
async def test_delete_task_not_found(task_repo, org_membership_facade, rbac):
    task_repo.get_by_id.return_value = None

    handler = DeleteTaskHandler(task_repo, org_membership_facade, rbac)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd())

    assert exc.value.status_code == 404


@pytest.mark.asyncio
async def test_delete_task_org_mismatch(task_repo, org_membership_facade, rbac):
    task = FakeTask()
    task.org_id = "other-org"

    task_repo.get_by_id.return_value = task

    handler = DeleteTaskHandler(task_repo, org_membership_facade, rbac)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd())

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_delete_task_rbac_called(task_repo, org_membership_facade, rbac):
    task = FakeTask()
    task_repo.get_by_id.return_value = task

    handler = DeleteTaskHandler(task_repo, org_membership_facade, rbac)

    await handler.handle(cmd())

    org_membership_facade.get_user_role.assert_awaited_once_with(
        "user-1",
        "org-1",
    )

    rbac.assert_can_delete.assert_called_once()


@pytest.mark.asyncio
async def test_delete_task_success(task_repo, org_membership_facade, rbac):
    task = FakeTask()
    task_repo.get_by_id.return_value = task
    task_repo.delete = AsyncMock()

    handler = DeleteTaskHandler(task_repo, org_membership_facade, rbac)

    result = await handler.handle(cmd())

    task_repo.delete.assert_awaited_once_with("task-1")

    assert result is None
