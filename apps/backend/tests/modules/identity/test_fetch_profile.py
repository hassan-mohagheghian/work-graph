import pytest
from src.modules.identity.application.handlers.fetch_user_profile_handler import (
    FetchUserProfileHandler,
)


from src.modules.identity.infrastructure.persistence.models import UserModel

from datetime import datetime, timezone
import uuid


@pytest.mark.asyncio
async def test_fetch_user_profile(user_repo):
    # Arrange: create a user in the database

    user = UserModel(
        id=uuid.uuid4(),
        email="test3@example.com",
        display_name="Test User",
        password_hash="hashed_password",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    await user_repo.add(user)

    # Act: fetch user profile
    handler = FetchUserProfileHandler(user_repo=user_repo)
    result = await handler.handle(email=user.email)

    # Assert: verify profile data
    assert result.id == user.id
    assert result.email == user.email
    assert result.display_name == user.display_name
    assert not hasattr(result, "password_hash")  # never return password
