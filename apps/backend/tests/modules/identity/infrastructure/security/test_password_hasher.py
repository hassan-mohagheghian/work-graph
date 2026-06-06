import pytest

from src.modules.identity.infrastructure.security.argon2_password_hasher import (
    Argon2PasswordHasher,
)


@pytest.fixture
def hasher():
    return Argon2PasswordHasher()


def test_hash_and_verify(hasher):
    password = "SecretPassword123!"
    hashed = hasher.hash(password=password)
    assert hashed != password
    assert hasher.verify(password=password, hashed=hashed)
    assert not hasher.verify("WrongPassword", hashed=hashed)
