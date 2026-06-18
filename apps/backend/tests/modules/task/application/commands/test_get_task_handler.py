from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from src.modules.task.application.queries.get_task.handler import GetTaskHandler
from src.modules.task.application.queries.get_task.query import GetTaskQuery


@pytest.fixture
def task_repo():
    return AsyncMock()


class FakeTask:
    def __init__(self):
        self.id = "task-1"
        self.org_id = "org-1"
        self.title = "Test Task"


def query():
    return GetTaskQuery(
        task_id="task-1",
        org_id="org-1",
    )


@pytest.mark.asyncio
async def test_get_task_org_mismatch(task_repo):
    task = FakeTask()
    task.org_id = "other-org"

    task_repo.get_by_id.return_value = task

    handler = GetTaskHandler(task_repo)

    with pytest.raises(HTTPException) as exc:
        await handler.handle(query())

    assert exc.value.status_code == 403


@pytest.mark.asyncio
async def test_get_task_success(task_repo):
    task = FakeTask()
    task_repo.get_by_id.return_value = task

    handler = GetTaskHandler(task_repo)

    result = await handler.handle(query())

    task_repo.get_by_id.assert_awaited_once_with("task-1")

    assert result == task
