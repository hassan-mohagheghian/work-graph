from abc import ABC, abstractmethod
from ..entities.user import User


class UserRepository(ABC):

    @abstractmethod
    async def add(self, user: User) -> None:
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:
        pass
