from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from src.modules.project.api.project_router import get_project_repo
from src.modules.task.api.mappers.task_list_mapper import TaskListResponseMapper
from src.modules.task.application.commands.create_task.command import CreateTaskCommand
from src.modules.task.application.commands.create_task.handler import CreateTaskHandler
from src.modules.task.application.commands.delete_task.command import DeleteTaskCommand
from src.modules.task.application.commands.delete_task.handler import DeleteTaskHandler
from src.modules.task.application.commands.update_task.command import UpdateTaskCommand
from src.modules.task.application.commands.update_task.handler import UpdateTaskHandler
from src.modules.task.application.queries.get_task.handler import GetTaskHandler
from src.modules.task.application.queries.get_task.query import GetTaskQuery
from src.modules.task.application.queries.list_tasks.handler import ListTasksHandler
from src.modules.task.application.queries.list_tasks.query import ListTasksQuery
from src.modules.task.application.services.task_rbac import TaskRBAC
from src.modules.task.domain.value_objects.task_status import TaskStatus
from src.modules.task.infrastructure.persistence.sqlalchemy_task_repo import (
    SqlAlchemyTaskRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id
from src.shared.infrastructure.dependencies.org import get_org_membership_facade
from src.shared.infrastructure.dependencies.org_context import (
    get_current_org_id,
    get_current_org_id_v1,
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


async def get_task_repo():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyTaskRepo(session=session)


class CreateTaskRequest(BaseModel):
    project_id: UUID
    title: str
    description: str | None = None


@router.post("")
async def create_task(
    body: CreateTaskRequest,
    task_repo=Depends(get_task_repo),
    org_id=Depends(get_current_org_id_v1),
):
    handler = CreateTaskHandler(task_repo)

    return await handler.handle(
        CreateTaskCommand(
            org_id=org_id,
            project_id=body.project_id,
            title=body.title,
            description=body.description,
        )
    )


@router.get("/project/{project_id}")
async def list_tasks_by_project(
    project_id: UUID,
    task_repo=Depends(get_task_repo),
    org_id=Depends(get_current_org_id),
):
    handler = ListTasksHandler(task_repo)

    return await handler.handle(ListTasksQuery(project_id=project_id))


class UpdateTaskRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None


@router.patch("/{task_id}")
async def update_task(
    task_id: UUID,
    body: UpdateTaskRequest,
    user_id=Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    task_repo=Depends(get_task_repo),
    project_repo=Depends(get_project_repo),
    org_membership_facade=Depends(get_org_membership_facade),
):
    handler = UpdateTaskHandler(
        task_repo=task_repo,
        project_repo=project_repo,
        org_membership_facade=org_membership_facade,
        rbac=TaskRBAC(),
    )

    return await handler.handle(
        UpdateTaskCommand(
            org_id=org_id,
            task_id=task_id,
            user_id=user_id,
            title=body.title,
            description=body.description,
            status=body.status,
        )
    )


@router.get("")
async def list_tasks(
    project_id: UUID | None = None,
    status: str | None = None,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    org_id=Depends(get_current_org_id),
    task_repo=Depends(get_task_repo),
):
    handler = ListTasksHandler(task_repo=task_repo)
    query = ListTasksQuery(
        org_id=org_id, project_id=project_id, status=status, limit=limit, offset=offset
    )
    query = ListTasksQuery(
        org_id=org_id,
        project_id=project_id,
        status=status,
        limit=limit,
        offset=offset,
    )

    result = await handler.handle(query)
    return TaskListResponseMapper.to_response(result)


@router.get("/{task_id}")
async def get_task(
    task_id: UUID,
    org_id=Depends(get_current_org_id),
    task_repo=Depends(get_task_repo),
):

    handler = GetTaskHandler(task_repo=task_repo)
    return await handler.handle(GetTaskQuery(task_id=task_id, org_id=org_id))


@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    org_id: UUID = Depends(get_current_org_id),
    task_repo=Depends(get_task_repo),
    org_membership_facade=Depends(get_org_membership_facade),
):
    handler = DeleteTaskHandler(
        task_repo=task_repo,
        org_membership_facade=org_membership_facade,
        rbac=TaskRBAC(),
    )
    await handler.handle(
        DeleteTaskCommand(task_id=task_id, org_id=org_id, user_id=user_id)
    )

    return {"status": "deleted"}
