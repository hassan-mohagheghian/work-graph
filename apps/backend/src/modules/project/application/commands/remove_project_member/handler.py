from src.modules.project.application.commands.remove_project_member.command import (
    RemoveProjectMemberCommand,
)
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)


class RemoveProjectMemberHandler:
    def __init__(self, repo: ProjectMembershipRepo):
        self.repo = repo

    async def handle(self, cmd: RemoveProjectMemberCommand):
        await self.repo.remove(cmd.project_id, cmd.user_id)
