from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.modules.project.api.project_router import get_project_repo
from src.modules.task.application.commands.create_task.command import CreateTaskCommand
from src.modules.task.application.commands.create_task.handler import CreateTaskHandler
from src.modules.task.application.commands.update_task.command import UpdateTaskCommand
from src.modules.task.application.commands.update_task.handler import UpdateTaskHandler
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
from src.shared.infrastructure.dependencies.org_context import get_current_org_id

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
    org_id=Depends(get_current_org_id),
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
async def list_tasks(
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
