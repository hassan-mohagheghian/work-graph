from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from src.modules.task.application.commands.update_task.command import UpdateTaskCommand
from src.modules.task.application.commands.update_task.handler import UpdateTaskHandler
from src.modules.task.domain.entities.task import Task
from src.modules.task.domain.value_objects.task_status import TaskStatus


@pytest.fixture
def task_repo():
    return AsyncMock()


@pytest.fixture
def project_repo():
    return AsyncMock()


def create_task():
    return Task(
        id="task-id",
        project_id="project-id",
        org_id="org-1",
        title="old title",
        description="old desc",
        status=TaskStatus.todo,
    )


@pytest.mark.asyncio
async def test_task_not_found(task_repo, project_repo):
    task_repo.get_by_id.return_value = None

    handler = UpdateTaskHandler(task_repo, project_repo)

    cmd = UpdateTaskCommand(
        task_id="task-id",
        org_id="org-1",
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd)

    assert exc.value.status_code == 404


@pytest.mark.asyncio
async def test_org_mismatch(task_repo, project_repo):
    task = create_task()
    task.org_id = "org-2"

    task_repo.get_by_id.return_value = task

    handler = UpdateTaskHandler(task_repo, project_repo)

    cmd = UpdateTaskCommand(
        task_id="task-id",
        org_id="org-1",
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd)

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_invalid_project(task_repo, project_repo):
    task = create_task()
    task_repo.get_by_id.return_value = task

    project_repo.get_by_id.return_value = None

    handler = UpdateTaskHandler(task_repo, project_repo)

    cmd = UpdateTaskCommand(
        task_id="task-id",
        org_id="org-1",
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd)

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_invalid_status_transition(task_repo, project_repo):
    task = create_task()
    task_repo.get_by_id.return_value = task

    project_repo.get_by_id.return_value = type("Project", (), {"org_id": "org-1"})

    handler = UpdateTaskHandler(task_repo, project_repo)

    cmd = UpdateTaskCommand(
        task_id="task-id",
        org_id="org-1",
        status=TaskStatus.done,  # invalid from TODO
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(cmd)

    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_success_update(task_repo, project_repo):
    task = create_task()
    task_repo.get_by_id.return_value = task

    project_repo.get_by_id.return_value = type("Project", (), {"org_id": "org-1"})

    task_repo.update = AsyncMock()

    handler = UpdateTaskHandler(task_repo, project_repo)

    cmd = UpdateTaskCommand(
        task_id="task-id",
        org_id="org-1",
        title="new title",
        description="new desc",
        status=TaskStatus.in_progress,
    )

    result = await handler.handle(cmd)

    assert result.title == "new title"
    assert result.description == "new desc"
    assert result.status == TaskStatus.in_progress

    task_repo.update.assert_awaited_once()
