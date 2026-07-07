from fastapi import HTTPException
from src.modules.planning.application.queries.get_milestone.query import (
    GetMilestoneQuery,
)
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo


class GetMilestoneHandler:
    def __init__(self, milestone_repo: MilestoneRepo):
        self.milestone_repo = milestone_repo

    async def handle(self, query: GetMilestoneQuery):
        milestone = await self.milestone_repo.get_by_id(query.milestone_id)

        if not milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")

        if milestone.org_id != query.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        return milestone
