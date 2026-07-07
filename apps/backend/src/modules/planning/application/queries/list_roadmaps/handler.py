from src.modules.planning.application.queries.list_roadmaps.query import (
    ListRoadmapsQuery,
)
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo


class ListRoadmapsHandler:
    def __init__(self, roadmap_repo: RoadmapRepo):
        self.roadmap_repo = roadmap_repo

    async def handle(self, query: ListRoadmapsQuery):
        if query.project_id:
            return await self.roadmap_repo.list_by_project(query.project_id)
        return await self.roadmap_repo.list_by_org(query.org_id)
