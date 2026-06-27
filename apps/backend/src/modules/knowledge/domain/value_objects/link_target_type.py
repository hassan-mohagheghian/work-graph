from enum import Enum


class LinkTargetType(str, Enum):
    project = "project"
    task = "task"
