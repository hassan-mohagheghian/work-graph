from fastapi import HTTPException
from src.modules.organization.application.facade import OrgMembershipFacade
from src.modules.task.application.commands.delete_task.command import DeleteTaskCommand
from src.modules.task.application.services.task_rbac import TaskRBAC
from src.modules.task.domain.repos.task_repo import TaskRepo


class DeleteTaskHandler:
    def __init__(
        self,
        task_repo: TaskRepo,
        org_membership_facade: OrgMembershipFacade,
        rbac: TaskRBAC,
    ):
        self.task_repo = task_repo
        self.org_membership_facade = org_membership_facade
        self.rbac = rbac

    async def handle(self, cmd: DeleteTaskCommand):
        task = await self.task_repo.get_by_id(cmd.task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        if task.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        role = await self.org_membership_facade.get_user_role(
            cmd.user_id,
            cmd.org_id,
        )

        self.rbac.assert_can_delete(role)

        await self.task_repo.delete(cmd.task_id)

        return None
