from fastapi import HTTPException
from src.modules.planning.application.commands.delete_roadmap.command import (
    DeleteRoadmapCommand,
)
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class DeleteRoadmapHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: DeleteRoadmapCommand):
        roadmap = await self.roadmap_repo.get_by_id(cmd.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        await self.roadmap_repo.delete(cmd.roadmap_id)
        return None
