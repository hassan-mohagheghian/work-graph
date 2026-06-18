from unittest.mock import AsyncMock

import pytest
from src.modules.task.application.queries.list_tasks.handler import ListTasksHandler
from src.modules.task.application.queries.list_tasks.query import ListTasksQuery


@pytest.fixture
def task_repo():
    return AsyncMock()


def query(**overrides):
    base = dict(
        org_id="org-1",
        project_id=None,
        status=None,
        limit=20,
        offset=0,
    )
    base.update(overrides)
    return ListTasksQuery(**base)


@pytest.mark.asyncio
async def test_list_tasks_basic(task_repo):
    task_repo.list.return_value = ["task-1", "task-2"]

    handler = ListTasksHandler(task_repo)

    result = await handler.handle(query())

    task_repo.list.assert_awaited_once_with(
        org_id="org-1",
        project_id=None,
        status=None,
        limit=20,
        offset=0,
    )

    assert result == ["task-1", "task-2"]


@pytest.mark.asyncio
async def test_list_tasks_project_filter(task_repo):
    task_repo.list.return_value = []

    handler = ListTasksHandler(task_repo)

    await handler.handle(query(project_id="project-123"))

    task_repo.list.assert_awaited_once_with(
        org_id="org-1",
        project_id="project-123",
        status=None,
        limit=20,
        offset=0,
    )


@pytest.mark.asyncio
async def test_list_tasks_status_filter(task_repo):
    task_repo.list.return_value = []

    handler = ListTasksHandler(task_repo)

    await handler.handle(query(status="todo"))

    task_repo.list.assert_awaited_once_with(
        org_id="org-1",
        project_id=None,
        status="todo",
        limit=20,
        offset=0,
    )


@pytest.mark.asyncio
async def test_list_tasks_pagination(task_repo):
    task_repo.list.return_value = []

    handler = ListTasksHandler(task_repo)

    await handler.handle(query(limit=10, offset=30))

    task_repo.list.assert_awaited_once_with(
        org_id="org-1",
        project_id=None,
        status=None,
        limit=10,
        offset=30,
    )


@pytest.mark.asyncio
async def test_list_tasks_combined_filters(task_repo):
    task_repo.list.return_value = ["task"]

    handler = ListTasksHandler(task_repo)

    await handler.handle(
        query(
            project_id="p1",
            status="in_progress",
            limit=5,
            offset=10,
        )
    )

    task_repo.list.assert_awaited_once_with(
        org_id="org-1",
        project_id="p1",
        status="in_progress",
        limit=5,
        offset=10,
    )
