from datetime import datetime, timezone
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from src.modules.identity.domain.entities.user import User
from src.modules.project.application.commands.add_project_member.command import (
    AddProjectMemberCommand,
)
from src.modules.project.application.commands.add_project_member.handler import (
    AddProjectMemberHandler,
)
from src.modules.project.domain.entities.project_membership import ProjectMembership


@pytest.fixture
def repo():
    return AsyncMock()


@pytest.fixture
def user_repo():
    return AsyncMock()


@pytest.fixture
def handler(repo, user_repo):
    return AddProjectMemberHandler(repo=repo, user_repo=user_repo)


@pytest.fixture
def command():
    return AddProjectMemberCommand(
        project_id=uuid4(),
        org_id=uuid4(),
        email="john@example.com",
        role="member",
    )


@pytest.fixture
def user():
    return User(
        id=uuid4(),
        username="john",
        display_name="john doe",
        email="john@example.com",
        password_hash="hashed-password",
        created_at=datetime.now(timezone.utc),
    )


@pytest.mark.asyncio
async def test_add_project_member_success(
    handler,
    repo,
    user_repo,
    command,
    user,
):
    membership = ProjectMembership(
        project_id=command.project_id,
        org_id=command.org_id,
        user_id=user.id,
        role=command.role,
        created_at=datetime.now(timezone.utc),
    )

    user_repo.get_by_email.return_value = user
    repo.add.return_value = membership

    result = await handler.handle(command)

    user_repo.get_by_email.assert_awaited_once_with(email=command.email)
    repo.add.assert_awaited_once()

    assert result == membership


@pytest.mark.asyncio
async def test_add_project_member_user_not_found(
    handler,
    user_repo,
    command,
):
    user_repo.get_by_email.return_value = None

    with pytest.raises(HTTPException) as exc:
        await handler.handle(command)

    assert exc.value.status_code == 404
    assert exc.value.detail == "User not found"


@pytest.mark.asyncio
async def test_add_project_member_duplicate_membership(
    handler,
    repo,
    user_repo,
    command,
    user,
):
    user_repo.get_by_email.return_value = user

    repo.add.side_effect = IntegrityError(
        statement=None,
        params=None,
        orig=None,
    )

    with pytest.raises(HTTPException) as exc:
        await handler.handle(command)

    assert exc.value.status_code == 409
