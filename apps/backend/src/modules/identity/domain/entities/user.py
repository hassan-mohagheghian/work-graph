from dataclasses import dataclass
from uuid import UUID, uuid4
from datetime import datetime
from datetime import timezone


@dataclass
class User:
    id: UUID
    username: str
    display_name: str
    email: str
    password_hash: str
    is_active: bool = True
    created_at: datetime = datetime.now(tz=timezone.utc)
    updated_at: datetime = datetime.now(tz=timezone.utc)

    @staticmethod
    def create(
        username: str, display_name: str, email: str, password_hash: str
    ) -> "User":
        return User(
            id=uuid4(),
            username=username,
            display_name=display_name,
            email=email,
            password_hash=password_hash,
        )
