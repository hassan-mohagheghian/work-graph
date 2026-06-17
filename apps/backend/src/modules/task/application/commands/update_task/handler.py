from fastapi import HTTPException
from src.modules.project.domain.repos.project_repo import ProjectRepository
from src.modules.task.application.commands.update_task.command import UpdateTaskCommand
from src.modules.task.domain.exceptions import InvalidTaskTransitionError
from src.modules.task.domain.repos.task_repo import TaskRepo


class UpdateTaskHandler:
    def __init__(self, task_repo: TaskRepo, project_repo: ProjectRepository):
        self.task_repo = task_repo
        self.project_repo = project_repo

    async def handle(self, cmd: UpdateTaskCommand):
        task = await self.task_repo.get_by_id(cmd.task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        if task.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        project = await self.project_repo.get_by_id(task.project_id)
        if not project or project.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Invalid project")

        if cmd.title is not None:
            task.title = cmd.title

        if cmd.description is not None:
            task.description = cmd.description

        if cmd.status is not None:
            try:
                task.change_status(cmd.status)
            except InvalidTaskTransitionError as e:
                raise HTTPException(status_code=400, detail=str(e))

        await self.task_repo.update(task)

        return task
