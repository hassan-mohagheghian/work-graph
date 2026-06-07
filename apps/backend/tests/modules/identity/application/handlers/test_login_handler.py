import uuid
from datetime import datetime, timezone
from unittest.mock import ANY

import pytest
from src.config.settings import settings
from src.modules.identity.application.dtos.login_result_dto import LoginResultDTO
from src.modules.identity.application.handlers.login_user_handler import (
    LoginUserHandler,
)
from src.modules.identity.application.queries.login_user_query import LoginUserQuery
from src.modules.identity.domain.entities.user import User
from src.modules.identity.infrastructure.security.argon2_password_hasher import (
    Argon2PasswordHasher,
)
from src.modules.identity.infrastructure.token.jwt_token_provider import (
    JWTTokenProvider,
)


@pytest.mark.asyncio
async def test_login_success(user_repo):
    # -------------------------
    # Arrange: create user
    # -------------------------
    password_hasher = Argon2PasswordHasher()
    token_provider = JWTTokenProvider(
        secret_key="test_secret_at_least_must_be_32_chars"
    )

    raw_password = "StrongPassword123!"
    hashed_password = password_hasher.hash(raw_password)

    user = User(
        id=uuid.uuid4(),
        email="login@example.com",
        username="login_user",
        display_name="Login User",
        password_hash=hashed_password,
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    await user_repo.add(user)

    # -------------------------
    # Act: login
    # -------------------------
    handler = LoginUserHandler(
        user_repo=user_repo,
        password_hasher=password_hasher,
        token_provider=token_provider,
    )

    result = await handler.handle(
        LoginUserQuery(
            email="login@example.com",
            password=raw_password,
        )
    )

    # -------------------------
    # Assert: check returned data
    # -------------------------
    assert result == LoginResultDTO(
        access_token=ANY,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )
