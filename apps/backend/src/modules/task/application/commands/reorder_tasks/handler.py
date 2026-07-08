from fastapi import HTTPException

from src.modules.task.application.commands.reorder_tasks.command import (
    ReorderTasksCommand,
)
from src.modules.task.domain.repos.task_repo import TaskRepo


class ReorderTasksHandler:
    def __init__(self, task_repo: TaskRepo):
        self.task_repo = task_repo

    async def handle(self, cmd: ReorderTasksCommand):
        await self.task_repo.reorder(cmd.project_id, cmd.ordered_ids)
