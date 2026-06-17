class TaskDomainError(Exception):
    pass


class InvalidTaskTransitionError(TaskDomainError):
    def __init__(self, current, target):
        super().__init__(f"Invalid transition: {current} → {target}")
