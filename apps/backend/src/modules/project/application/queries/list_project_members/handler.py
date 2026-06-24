from src.modules.project.application.queries.list_project_members.query import (
    ListProjectMembersQuery,
)
from src.modules.project.application.queries.list_project_members.result import (
    ProjectMemberResult,
)
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)


class ListProjectMembersHandler:
    def __init__(self, repository: ProjectMembershipRepo) -> None:
        self._repository = repository

    async def handle(self, query: ListProjectMembersQuery) -> list[ProjectMemberResult]:
        memberships = await self._repository.list_by_project(query.project_id)

        return [
            ProjectMemberResult(
                id=m.id, user_id=m.user_id, project_id=m.project_id, role=m.role
            )
            for m in memberships
        ]
