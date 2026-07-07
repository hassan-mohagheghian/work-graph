from sqlalchemy import Column, Integer, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.modules.planning.domain.value_objects.milestone_status import MilestoneStatus
from src.modules.planning.domain.value_objects.roadmap_status import RoadmapStatus
from src.modules.planning.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import IDMixin, TimestampedMixin


class RoadmapModel(IDMixin, TimestampedMixin, Base):
    __table_args__ = {"schema": "planning"}
    __tablename__ = "roadmaps"

    project_id = Column(PG_UUID(as_uuid=True), nullable=False)
    org_id = Column(PG_UUID(as_uuid=True), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    status = Column(
        SAEnum(RoadmapStatus, name="roadmap_status"),
        default=RoadmapStatus.draft,
        nullable=False,
    )
    creator_id = Column(PG_UUID(as_uuid=True), nullable=True)


class MilestoneModel(IDMixin, TimestampedMixin, Base):
    __table_args__ = {"schema": "planning"}
    __tablename__ = "milestones"

    roadmap_id = Column(PG_UUID(as_uuid=True), nullable=False)
    org_id = Column(PG_UUID(as_uuid=True), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    status = Column(
        SAEnum(MilestoneStatus, name="milestone_status"),
        default=MilestoneStatus.pending,
        nullable=False,
    )
    order = Column(Integer, nullable=False, default=0)
    creator_id = Column(PG_UUID(as_uuid=True), nullable=True)
