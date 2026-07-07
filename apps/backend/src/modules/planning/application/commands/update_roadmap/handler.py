from fastapi import HTTPException
from src.modules.planning.application.commands.update_roadmap.command import (
    UpdateRoadmapCommand,
)
from src.modules.planning.domain.exceptions import InvalidRoadmapTransitionError
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class UpdateRoadmapHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: UpdateRoadmapCommand):
        roadmap = await self.roadmap_repo.get_by_id(cmd.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        if cmd.title is not None:
            roadmap.title = cmd.title

        if cmd.description is not None:
            roadmap.description = cmd.description

        if cmd.status is not None:
            try:
                roadmap.change_status(cmd.status)
            except InvalidRoadmapTransitionError as e:
                raise HTTPException(status_code=400, detail=str(e))

        await self.roadmap_repo.update(roadmap)
        return roadmap
