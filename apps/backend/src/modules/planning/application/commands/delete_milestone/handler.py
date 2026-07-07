from fastapi import HTTPException
from src.modules.planning.application.commands.delete_milestone.command import (
    DeleteMilestoneCommand,
)
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo


class DeleteMilestoneHandler:
    def __init__(self, milestone_repo: MilestoneRepo):
        self.milestone_repo = milestone_repo

    async def handle(self, cmd: DeleteMilestoneCommand):
        milestone = await self.milestone_repo.get_by_id(cmd.milestone_id)

        if not milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")

        if milestone.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        await self.milestone_repo.delete(cmd.milestone_id)
        return None
