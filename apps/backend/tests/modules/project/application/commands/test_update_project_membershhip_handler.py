from uuid import uuid4

import pytest
from src.modules.project.application.commands.update_project_member.command import (
    UpdateProjectMemberRoleCommand,
)
from src.modules.project.application.commands.update_project_member.handler import (
    UpdateProjectMemberRoleHandler,
)


@pytest.mark.asyncio
async def test_update_project_member_role(project_membership_repo):
    project_id = uuid4()
    user_id = uuid4()
    org_id = uuid4()

    # seed existing membership
    await project_membership_repo.add(project_id, org_id, user_id, "member")

    cmd = UpdateProjectMemberRoleCommand(
        project_id=project_id,
        user_id=user_id,
        role="admin",
    )

    handler = UpdateProjectMemberRoleHandler(repo=project_membership_repo)

    await handler.handle(cmd)

    role = await project_membership_repo.get_role(project_id, user_id)

    assert role == "admin"
