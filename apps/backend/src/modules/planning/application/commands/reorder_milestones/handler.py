from fastapi import HTTPException
from src.modules.planning.application.commands.reorder_milestones.command import (
    ReorderMilestonesCommand,
)
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class ReorderMilestonesHandler:
    def __init__(self, milestone_repo: MilestoneRepo, roadmap_repo: RoadmapRepo):
        self.milestone_repo = milestone_repo
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: ReorderMilestonesCommand):
        roadmap = await self.roadmap_repo.get_by_id(cmd.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        await self.milestone_repo.reorder(cmd.roadmap_id, cmd.ordered_ids)
        return await self.milestone_repo.list_by_roadmap(cmd.roadmap_id)
