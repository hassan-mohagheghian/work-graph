from uuid import uuid4

import pytest
from src.modules.project.application.commands.remove_project_member.command import (
    RemoveProjectMemberCommand,
)
from src.modules.project.application.commands.remove_project_member.handler import (
    RemoveProjectMemberHandler,
)


@pytest.mark.asyncio
async def test_remove_project_member(project_membership_repo):
    project_id = uuid4()
    user_id = uuid4()
    org_id = uuid4()

    # seed existing membership
    await project_membership_repo.add(project_id, org_id, user_id, "member")

    cmd = RemoveProjectMemberCommand(
        project_id=project_id,
        user_id=user_id,
    )
    handler = RemoveProjectMemberHandler(repo=project_membership_repo)

    await handler.handle(cmd)

    exists = await project_membership_repo.exists(project_id, user_id)

    assert exists is False
