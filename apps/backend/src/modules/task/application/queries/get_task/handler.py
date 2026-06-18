from fastapi import HTTPException
from src.modules.task.application.queries.get_task.query import GetTaskQuery
from src.modules.task.domain.repos.task_repo import TaskRepo


class GetTaskHandler:
    def __init__(self, task_repo: TaskRepo):
        self.task_repo = task_repo

    async def handle(self, query: GetTaskQuery):
        task = await self.task_repo.get_by_id(query.task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        if task.org_id != query.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        return task
