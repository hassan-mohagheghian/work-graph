from abc import ABC, abstractmethod


class PasswordHasher(ABC):
    """Interface for password hashing and verification"""

    @abstractmethod
    def hash(self, password: str) -> str:
        """Return a hashed version of the password"""
        pass

    @abstractmethod
    def verify(self, password: str, hashed: str) -> bool:
        """Verify that a password matched the hashed value.s"""
        pass
