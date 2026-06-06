from src.modules.identity.domain.ports.password_hasher import (
    PasswordHasher,
)
from argon2 import PasswordHasher as Argon2Hasher


class Argon2PasswordHasher(PasswordHasher):

    def __init__(self):
        self._hasher = Argon2Hasher()

    def hash(self, password: str) -> str:
        return self._hasher.hash(password=password)

    def verify(self, password: str, hashed: str) -> bool:
        try:
            return self._hasher.verify(hash=hashed, password=password)
        except Exception:
            return False
