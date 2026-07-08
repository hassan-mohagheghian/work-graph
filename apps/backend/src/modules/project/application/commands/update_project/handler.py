from src.modules.project.application.commands.update_project.command import (
    UpdateProjectCommand,
)
from src.modules.project.domain.repos.project_repo import ProjectRepository


class UpdateProjectHandler:
    def __init__(self, project_repo: ProjectRepository):
        self.project_repo = project_repo

    async def handle(self, cmd: UpdateProjectCommand):
        project = await self.project_repo.get_by_id(cmd.project_id)

        if not project:
            raise ValueError("Project not found")

        if project.org_id != cmd.org_id:
            raise ValueError("Not allowed")

        if cmd.name is not None:
            project.name = cmd.name
        if cmd.description is not None:
            project.description = cmd.description

        await self.project_repo.update(project)
        return project
