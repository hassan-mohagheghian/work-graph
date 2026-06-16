from datetime import datetime, timezone

from src.modules.task.domain.entities.task import Task
from src.modules.task.domain.repos.task_repo import TaskRepo


class CreateTaskHandler:
    def __init__(self, task_repo: TaskRepo):
        self.task_repo = task_repo

    async def handle(self, cmd):
        task = Task(
            org_id=cmd.org_id,
            project_id=cmd.project_id,
            title=cmd.title,
            description=cmd.description,
            created_at=datetime.now(timezone.utc),
        )

        await self.task_repo.create(task)
        return task
