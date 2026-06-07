import uuid
from abc import ABC
from typing import Self
from uuid import UUID


class Entity(ABC):
    def __init__(self, id: UUID | None = None):
        self.id = id or uuid.uuid4()

    def __eq__(self, other: Self):
        if isinstance(other, self.__class__):
            return self.id == other.id
        return False

    def __hash__(self):
        return hash(self.id)
