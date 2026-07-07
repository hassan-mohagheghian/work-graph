from enum import Enum


class RoadmapStatus(str, Enum):
    draft = "draft"
    active = "active"
    completed = "completed"
    archived = "archived"
