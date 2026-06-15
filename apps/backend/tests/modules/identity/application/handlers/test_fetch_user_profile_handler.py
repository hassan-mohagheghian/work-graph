# apps/backend/tests/modules/identity/application/test_fetch_user_profile_handler.py

import uuid
from datetime import datetime, timezone

import pytest
from src.modules.identity.application.handlers.fetch_user_profile_handler import (
    FetchUserProfileHandler,
)
from src.modules.identity.domain.entities.user import User


@pytest.mark.asyncio
async def test_fetch_user_profile(user_repo):
    # --- Arrange ---
    user = User(
        id=uuid.uuid4(),
        email="test@example.com",
        username="testuser",
        display_name="Test User",
        password_hash="hashed_password",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    await user_repo.add(user)

    # --- Act ---
    handler = FetchUserProfileHandler(user_repo=user_repo)
    result = await handler.handle(id=user.id)

    # --- Assert ---
    assert result.id == user.id
    assert result.email == user.email
    assert result.display_name == user.display_name
    assert not hasattr(result, "password_hash")
