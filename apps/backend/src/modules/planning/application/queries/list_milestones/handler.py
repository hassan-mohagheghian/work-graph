from fastapi import HTTPException
from src.modules.planning.application.queries.list_milestones.query import (
    ListMilestonesQuery,
)
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class ListMilestonesHandler:
    def __init__(self, milestone_repo: MilestoneRepo, roadmap_repo: RoadmapRepo):
        self.milestone_repo = milestone_repo
        self.roadmap_repo = roadmap_repo

    async def handle(self, query: ListMilestonesQuery):
        roadmap = await self.roadmap_repo.get_by_id(query.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != query.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        return await self.milestone_repo.list_by_roadmap(query.roadmap_id)
