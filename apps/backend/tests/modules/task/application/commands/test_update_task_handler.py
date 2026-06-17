from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.task.application.commands.update_task.command import UpdateTaskCommand
from src.modules.task.application.commands.update_task.handler import UpdateTaskHandler
from src.modules.task.domain.exceptions import InvalidTaskTransitionError

# --------------------
# FIXTURES
# --------------------


@pytest.fixture
def task_repo():
    return AsyncMock()


@pytest.fixture
def project_repo():
    return AsyncMock()


@pytest.fixture
def org_membership_facade():
    facade = AsyncMock()
    facade.get_user_role = AsyncMock(return_value=OrgRole.MEMBER)
    return facade


@pytest.fixture
def rbac():
    rbac = MagicMock()
    rbac.assert_can_update = MagicMock()
    return rbac


# --------------------
# FAKE DOMAIN OBJECT
# --------------------


class FakeTask:
    def __init__(self):
        self.id = "task-1"
        self.project_id = "project-1"
        self.org_id = "org-1"
        self.title = "old"
        self.description = "old"
        self.status = "todo"

    def change_status(self, new_status):
        if new_status == "invalid":
            raise InvalidTaskTransitionError("todo", new_status)
        self.status = new_status


def cmd():
    return UpdateTaskCommand(
        task_id="task-1",
        org_id="org-1",
        user_id="user-1",
        title=None,
        description=None,
        status=None,
    )


# --------------------
# TESTS
# --------------------


@pytest.mark.asyncio
async def test_task_not_found(task_repo, project_repo, org_membership_facade, rbac):
    task_repo.get_by_id.return_value = None

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd())

    assert exc.value.status_code == 404


@pytest.mark.asyncio
async def test_org_mismatch(task_repo, project_repo, org_membership_facade, rbac):
    task = FakeTask()
    task.org_id = "other-org"

    task_repo.get_by_id.return_value = task

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd())

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_invalid_project(task_repo, project_repo, org_membership_facade, rbac):
    task = FakeTask()
    task_repo.get_by_id.return_value = task
    project_repo.get_by_id.return_value = None

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd())

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_rbac_called(task_repo, project_repo, org_membership_facade, rbac):
    task = FakeTask()
    task_repo.get_by_id.return_value = task
    project_repo.get_by_id.return_value = MagicMock(org_id="org-1")

    org_membership_facade.get_user_role = AsyncMock(return_value=OrgRole.ADMIN)

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    await handler.handle(cmd())

    org_membership_facade.get_user_role.assert_awaited_once_with(
        "user-1",
        "org-1",
    )

    rbac.assert_can_update.assert_called_once_with(role=OrgRole.ADMIN)


@pytest.mark.asyncio
async def test_rbac_blocks(task_repo, project_repo, org_membership_facade, rbac):
    task = FakeTask()
    task_repo.get_by_id.return_value = task
    project_repo.get_by_id.return_value = MagicMock(org_id="org-1")

    org_membership_facade.get_user_role = AsyncMock(return_value=OrgRole.MEMBER)

    def block(*args, **kwargs):
        raise HTTPException(status_code=403)

    rbac.assert_can_update.side_effect = block

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd())

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_success_update(task_repo, project_repo, org_membership_facade, rbac):
    task = FakeTask()
    task_repo.get_by_id.return_value = task
    project_repo.get_by_id.return_value = MagicMock(org_id="org-1")

    org_membership_facade.get_user_role = AsyncMock(return_value=OrgRole.ADMIN)

    task_repo.update = AsyncMock()

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    command = UpdateTaskCommand(
        task_id="task-1",
        org_id="org-1",
        user_id="user-1",
        title="new title",
        description="new desc",
        status=None,
    )

    result = await handler.handle(command)

    assert result.title == "new title"
    assert result.description == "new desc"

    task_repo.update.assert_awaited_once()


@pytest.mark.asyncio
async def test_invalid_status_transition(
    task_repo, project_repo, org_membership_facade, rbac
):
    task = FakeTask()
    task_repo.get_by_id.return_value = task
    project_repo.get_by_id.return_value = MagicMock(org_id="org-1")

    org_membership_facade.get_user_role = AsyncMock(return_value=OrgRole.ADMIN)

    handler = UpdateTaskHandler(task_repo, project_repo, org_membership_facade, rbac)

    command = UpdateTaskCommand(
        task_id="task-1",
        org_id="org-1",
        user_id="user-1",
        status="invalid",
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(command)

    assert exc.value.status_code == 400
