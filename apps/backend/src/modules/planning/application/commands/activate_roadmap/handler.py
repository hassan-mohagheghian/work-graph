from fastapi import HTTPException
from src.modules.planning.application.commands.activate_roadmap.command import (
    ActivateRoadmapCommand,
)
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo
from src.modules.planning.domain.value_objects.roadmap_status import RoadmapStatus


class ActivateRoadmapHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: ActivateRoadmapCommand):
        roadmap = await self.roadmap_repo.get_by_id(cmd.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        roadmap.change_status(RoadmapStatus.active)

        await self.roadmap_repo.update(roadmap)
        return roadmap
