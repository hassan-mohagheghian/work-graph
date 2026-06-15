from src.modules.project.application.queries.list_projects.query import (
    ListProjectsQuery,
)
from src.modules.project.application.queries.list_projects.response import ProjectResult


class ListProjectsHandler:
    def __init__(self, project_repo):
        self.project_repo = project_repo

    async def handle(self, query: ListProjectsQuery) -> list[ProjectResult]:
        projects = await self.project_repo.list_by_org(query.org_id)

        return [ProjectResult(id=str(p.id), name=p.name) for p in projects]
