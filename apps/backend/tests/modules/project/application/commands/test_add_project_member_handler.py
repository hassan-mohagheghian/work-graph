from uuid import uuid4

import pytest
from src.modules.project.application.commands.add_project_member.command import (
    AddProjectMemberCommand,
)
from src.modules.project.application.commands.add_project_member.handler import (
    AddProjectMemberHandler,
)


@pytest.mark.asyncio
async def test_add_project_member(project_membership_repo):
    project_id = uuid4()
    org_id = uuid4()
    user_id = uuid4()

    cmd = AddProjectMemberCommand(
        project_id=project_id,
        org_id=org_id,
        user_id=user_id,
        role="member",
    )

    handler = AddProjectMemberHandler(repo=project_membership_repo)

    result = await handler.handle(cmd)

    assert result is not None

    exists = await project_membership_repo.exists(project_id, user_id)
    assert exists is True
