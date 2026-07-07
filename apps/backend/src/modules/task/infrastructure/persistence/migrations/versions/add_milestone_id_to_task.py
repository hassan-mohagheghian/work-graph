"""add milestone_id to task

Revision ID: add_milestone_id
Revises: ca36717152ab
Create Date: 2026-07-07 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "add_milestone_id"
down_revision: Union[str, Sequence[str], None] = "ca36717152ab"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column("milestone_id", sa.UUID(), nullable=True),
        schema="task",
    )


def downgrade() -> None:
    op.drop_column("tasks", "milestone_id", schema="task")
