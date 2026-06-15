from src.modules.project.application.commands.create_project.command import (
    CreateProjectCommand,
)
from src.modules.project.application.commands.create_project.result import (
    CreateProjectResult,
)
from src.modules.project.domain.entities.project import Project


class CreateProjectHandler:
    def __init__(self, project_repo):
        self.project_repo = project_repo

    async def handle(self, cmd: CreateProjectCommand) -> CreateProjectResult:
        project = Project(
            org_id=cmd.org_id,
            name=cmd.name,
            description=cmd.description,
        )

        await self.project_repo.create(project)
        return CreateProjectResult(
            id=project.id,
            org_id=project.org_id,
            name=project.name,
            description=project.description,
            created_at=project.created_at,
        )
