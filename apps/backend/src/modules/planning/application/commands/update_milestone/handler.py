from fastapi import HTTPException
from src.modules.planning.application.commands.update_milestone.command import (
    UpdateMilestoneCommand,
)
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo


class UpdateMilestoneHandler:
    def __init__(self, milestone_repo: MilestoneRepo):
        self.milestone_repo = milestone_repo

    async def handle(self, cmd: UpdateMilestoneCommand):
        milestone = await self.milestone_repo.get_by_id(cmd.milestone_id)

        if not milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")

        if milestone.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        if cmd.title is not None:
            milestone.title = cmd.title

        if cmd.description is not None:
            milestone.description = cmd.description

        if cmd.order is not None:
            milestone.order = cmd.order

        if cmd.status is not None:
            milestone.change_status(cmd.status)

        await self.milestone_repo.update(milestone)
        return milestone
