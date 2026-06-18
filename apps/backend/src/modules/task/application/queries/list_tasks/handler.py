from src.modules.task.application.queries.list_tasks.query import ListTasksQuery
from src.modules.task.domain.repos.task_repo import TaskRepo


class ListTasksHandler:
    def __init__(self, task_repo: TaskRepo):
        self.task_repo = task_repo

    async def handle(self, query: ListTasksQuery):
        return await self.task_repo.list(
            org_id=query.org_id,
            project_id=query.project_id,
            status=query.status,
            limit=query.limit,
            offset=query.offset,
        )
