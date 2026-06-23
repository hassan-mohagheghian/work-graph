from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.modules.project.application.commands.add_project_member.command import (
    AddProjectMemberCommand,
)
from src.modules.project.application.commands.add_project_member.handler import (
    AddProjectMemberHandler,
)
from src.modules.project.application.commands.create_project.command import (
    CreateProjectCommand,
)
from src.modules.project.application.commands.create_project.handler import (
    CreateProjectHandler,
)
from src.modules.project.application.commands.remove_project_member.command import (
    RemoveProjectMemberCommand,
)
from src.modules.project.application.commands.update_project_member.command import (
    UpdateProjectMemberRoleCommand,
)
from src.modules.project.application.commands.update_project_member.handler import (
    UpdateProjectMemberRoleHandler,
)
from src.modules.project.application.queries.list_projects.handler import (
    ListProjectsHandler,
)
from src.modules.project.application.queries.list_projects.query import (
    ListProjectsQuery,
)
from src.modules.project.domain.entities.project_membership import ProjectMembership
from src.modules.project.infrastructure.persistence.sqlalchemy_project_repo import (
    SqlAlchemyProjectRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.org_context import get_current_org_id
from src.shared.infrastructure.dependencies.project import get_project_membership_repo


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
    project_repo=Depends(get_project_repo),
    org_id=Depends(get_current_org_id),
):
    handler = ListProjectsHandler(project_repo)

    return await handler.handle(ListProjectsQuery(org_id=org_id))


@router.post("/{project_id}/members")
async def add_member(
    project_id: UUID,
    body: dict,
    project_membership_repo: ProjectMembership = Depends(get_project_membership_repo),
):
    handler = AddProjectMemberHandler(repo=project_membership_repo)
    return await handler.handle(
        AddProjectMemberCommand(
            project_id=project_id,
            org_id=body["org_id"],
            user_id=body["user_id"],
            role=body.get("role", "member"),
        )
    )


@router.patch("/{project_id}/members/{user_id}")
async def update_role(
    project_id: UUID,
    user_id: UUID,
    body: dict,
    project_membership_repo: ProjectMembership = Depends(get_project_membership_repo),
):
    handler = UpdateProjectMemberRoleHandler(repo=project_membership_repo)
    return await handler.handle(
        UpdateProjectMemberRoleCommand(
            project_id=project_id, user_id=user_id, role=body["role"]
        )
    )


@router.delete("/{project_id}/members/{user_id}")
async def remove_member(
    project_id: UUID,
    user_id: UUID,
    project_membership_repo: ProjectMembership = Depends(get_project_membership_repo),
):
    handler = UpdateProjectMemberRoleHandler(repo=project_membership_repo)
    return await handler.handle(
        RemoveProjectMemberCommand(project_id=project_id, user_id=user_id)
    )
