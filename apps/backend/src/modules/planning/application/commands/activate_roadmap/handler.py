from fastapi import HTTPException
from src.modules.planning.application.commands.activate_roadmap.command import (
    ActivateRoadmapCommand,
)
from src.modules.planning.domain.exceptions import InvalidRoadmapTransitionError
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class ActivateRoadmapHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: ActivateRoadmapCommand):
        roadmap = await self.roadmap_repo.get_by_id(cmd.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        try:
            roadmap.activate()
        except InvalidRoadmapTransitionError as e:
            raise HTTPException(status_code=400, detail=str(e))

        await self.roadmap_repo.update(roadmap)
        return roadmap
