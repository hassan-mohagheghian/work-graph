from dataclasses import dataclass, field
from uuid import UUID, uuid4


@dataclass(eq=False, kw_only=True)
class Entity:
    id: UUID = field(default_factory=uuid4)

    def __eq__(self, other):
        return isinstance(other, self.__class__) and self.id == other.id

    def __hash__(self):
        return hash(self.id)
