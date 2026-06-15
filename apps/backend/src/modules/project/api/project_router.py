from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.modules.project.application.commands.create_project.command import (
    CreateProjectCommand,
)
from src.modules.project.application.commands.create_project.handler import (
    CreateProjectHandler,
)
from src.modules.project.application.queries.list_projects.handler import (
    ListProjectsHandler,
)
from src.modules.project.application.queries.list_projects.query import (
    ListProjectsQuery,
)
from src.modules.project.infrastructure.persistence.sqlalchemy_project_repo import (
    SqlAlchemyProjectRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.org_context import get_current_org_id


async def get_project_repo():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyProjectRepo(session=session)


router = APIRouter(prefix="/projects", tags=["projects"])


class CreateProjectRequest(BaseModel):
    name: str
    description: str | None = None


@router.post("")
async def create_project(
    body: CreateProjectRequest,
    project_repo=Depends(get_project_repo),
    org_id=Depends(get_current_org_id),
):
    handler = CreateProjectHandler(project_repo)

    project = await handler.handle(
        CreateProjectCommand(
            org_id=org_id,
            name=body.name,
            description=body.description,
        )
    )

    return {
        "id": str(project.id),
        "name": project.name,
    }


@router.get("/org/{org_id}")
async def list_projects(
    org_id: UUID,
    project_repo=Depends(get_project_repo),
):
    handler = ListProjectsHandler(project_repo)

    return await handler.handle(ListProjectsQuery(org_id=org_id))
