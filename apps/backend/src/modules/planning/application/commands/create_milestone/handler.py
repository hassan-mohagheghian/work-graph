from fastapi import HTTPException

from src.modules.planning.application.commands.create_milestone.command import (
    CreateMilestoneCommand,
)
from src.modules.planning.domain.entities.milestone import Milestone
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class CreateMilestoneHandler:
    def __init__(self, milestone_repo: MilestoneRepo, roadmap_repo: RoadmapRepo):
        self.milestone_repo = milestone_repo
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: CreateMilestoneCommand):
        roadmap = await self.roadmap_repo.get_by_id(cmd.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        print("---------here", type(roadmap.org_id), type(cmd.org_id))
        if roadmap.org_id != cmd.org_id:
            print("in there")
            raise HTTPException(status_code=403, detail="Not allowed")

        milestone = Milestone(
            org_id=cmd.org_id,
            roadmap_id=cmd.roadmap_id,
            title=cmd.title,
            description=cmd.description,
            order=cmd.order,
            creator_id=cmd.creator_id,
        )

        await self.milestone_repo.create(milestone)
        return milestone
