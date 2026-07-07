from src.modules.planning.application.commands.create_roadmap.command import (
    CreateRoadmapCommand,
)
from src.modules.planning.domain.entities.roadmap import Roadmap
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class CreateRoadmapHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, cmd: CreateRoadmapCommand):
        roadmap = Roadmap(
            org_id=cmd.org_id,
            project_id=cmd.project_id,
            title=cmd.title,
            description=cmd.description,
            creator_id=cmd.creator_id,
        )

        await self.roadmap_repo.create(roadmap)
        return roadmap
