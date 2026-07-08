from dataclasses import dataclass
from datetime import datetime


@dataclass
class ProjectResult:
    id: str
    name: str
    description: str | None
    created_at: datetime
