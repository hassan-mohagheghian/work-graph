from src.modules.project.application.commands.update_project_member.command import (
    UpdateProjectMemberRoleCommand,
)
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)


class UpdateProjectMemberRoleHandler:
    def __init__(self, repo: ProjectMembershipRepo):
        self.repo = repo

    async def handle(self, cmd: UpdateProjectMemberRoleCommand):
        await self.repo.update_role(
            cmd.project_id,
            cmd.user_id,
            cmd.role,
        )
