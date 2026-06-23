from src.modules.project.application.commands.add_project_member.command import (
    AddProjectMemberCommand,
)
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)


class AddProjectMemberHandler:
    def __init__(self, repo: ProjectMembershipRepo):
        self.repo = repo

    async def handle(self, cmd: AddProjectMemberCommand):
        return await self.repo.add(
            cmd.project_id,
            cmd.org_id,
            cmd.user_id,
            cmd.role,
        )
