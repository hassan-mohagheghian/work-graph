from dataclasses import dataclass
from typing import Self
from uuid import UUID, uuid4
from datetime import datetime
from datetime import timezone


@dataclass
class User:
    id: UUID
    display_name: str
    email: str
    password_hash: str
    username: str = None
    is_active: bool = True
    created_at: datetime = datetime.now(tz=timezone.utc)
    updated_at: datetime = datetime.now(tz=timezone.utc)

    @staticmethod
    def create(display_name: str, email: str, password_hash: str) -> Self:
        return User(
            id=uuid4(),
            display_name=display_name,
            email=email,
            password_hash=password_hash,
            created_at=datetime.now(timezone.utc),
        )
