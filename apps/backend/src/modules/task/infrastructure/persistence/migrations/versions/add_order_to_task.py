"""add order to task

Revision ID: add_order_to_task
Revises: add_milestone_id
Create Date: 2026-07-08 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "add_order_to_task"
down_revision: Union[str, Sequence[str], None] = "add_milestone_id"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column("order", sa.Integer(), nullable=False, server_default="0"),
        schema="task",
    )


def downgrade() -> None:
    op.drop_column("tasks", "order", schema="task")
