class ListTasksHandler:
    def __init__(self, task_repo):
        self.task_repo = task_repo

    async def handle(self, query):
        return await self.task_repo.list_by_project(query.project_id)
