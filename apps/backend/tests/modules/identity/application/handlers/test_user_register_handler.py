import pytest
from datetime import datetime, timezone
import uuid

from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.application.handlers.register_user_handler import (
    RegisterUerHandler,
)
from src.modules.identity.domain.entities.user import User
from src.modules.identity.infrastructure.security.argon2_password_hasher import (
    Argon2PasswordHasher,
)


@pytest.mark.asyncio
async def test_register_user_success(user_repo):
    # -------------------------
    # Arrange
    # -------------------------
    password_hasher = Argon2PasswordHasher()

    handler = RegisterUerHandler(user_repo=user_repo, password_hasher=password_hasher)

    email = "register@example.com"
    password = "StrongPassword123!"
    username = "register_user"
    display_name = "Register User"

    # -------------------------
    # Act
    # -------------------------
    result = await handler.handle(
        RegisterUserCommand(
            email=email,
            password=password,
            display_name=display_name,
        )
    )

    # -------------------------
    # Assert
    # -------------------------
    assert result is not None
    assert result.email == email
    assert result.display_name == display_name
    assert hasattr(result, "id")
