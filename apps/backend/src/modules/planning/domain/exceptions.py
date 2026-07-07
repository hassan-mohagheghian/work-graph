class PlanningDomainError(Exception):
    pass


class RoadmapNotFoundError(PlanningDomainError):
    def __init__(self, roadmap_id=None):
        super().__init__(f"Roadmap not found: {roadmap_id}")


class MilestoneNotFoundError(PlanningDomainError):
    def __init__(self, milestone_id=None):
        super().__init__(f"Milestone not found: {milestone_id}")


class InvalidRoadmapTransitionError(PlanningDomainError):
    def __init__(self, current, target):
        super().__init__(f"Invalid roadmap transition: {current} → {target}")


class InvalidMilestoneTransitionError(PlanningDomainError):
    def __init__(self, current, target):
        super().__init__(f"Invalid milestone transition: {current} → {target}")


class MilestoneOrderError(PlanningDomainError):
    pass
