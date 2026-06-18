from src.modules.task.api.schemas.task_list_response import (
    TaskListResponse,
    TaskResponse,
)
from src.modules.task.domain.entities.task import Task


class TaskResponseMapper:
    @staticmethod
    def to_response(task: Task) -> TaskResponse:
        return TaskResponse(
            id=task.id,
            project_id=task.project_id,
            org_id=task.org_id,
            title=task.title,
            description=task.description,
            status=task.status,
            created_at=task.created_at,
        )


class TaskListResponseMapper:
    @staticmethod
    def to_response(tasks: list[Task]) -> TaskListResponse:
        return TaskListResponse(
            items=[TaskResponseMapper.to_response(task) for task in tasks]
        )
