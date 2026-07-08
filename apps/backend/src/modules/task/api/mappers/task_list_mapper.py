from src.modules.task.api.schemas.task_list_response import (
    TaskListResponse,
    TaskResponse,
)
from src.modules.task.domain.entities.task import Task


class TaskResponseMapper:
    @staticmethod
    def to_response(
        task: Task,
        roadmap_title: str | None = None,
        milestone_title: str | None = None,
    ) -> TaskResponse:
        return TaskResponse(
            id=task.id,
            project_id=task.project_id,
            org_id=task.org_id,
            title=task.title,
            description=task.description,
            status=task.status,
            milestone_id=task.milestone_id,
            roadmap_title=roadmap_title,
            milestone_title=milestone_title,
            created_at=task.created_at,
        )


class TaskListResponseMapper:
    @staticmethod
    def to_response(
        tasks: list[tuple[Task, str | None, str | None]],
    ) -> TaskListResponse:
        return TaskListResponse(
            items=[
                TaskResponseMapper.to_response(task, roadmap_title, milestone_title)
                for task, roadmap_title, milestone_title in tasks
            ]
        )
