from fastapi import HTTPException
from src.modules.planning.application.queries.get_roadmap.query import GetRoadmapQuery
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class GetRoadmapHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, query: GetRoadmapQuery):
        roadmap = await self.roadmap_repo.get_by_id(query.roadmap_id)

        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        if roadmap.org_id != query.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        return roadmap
