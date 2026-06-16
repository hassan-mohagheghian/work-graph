"""follow task_status in model, vo in entity

Revision ID: afadc65ede63
Revises: b6d206d2afbf
Create Date: 2026-06-16 20:02:04.010407

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "afadc65ede63"
down_revision: Union[str, Sequence[str], None] = "b6d206d2afbf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    task_status = sa.Enum(
        "todo",
        "in_progress",
        "done",
        name="task_status",
    )
    task_status.create(op.get_bind())

    op.alter_column(
        "tasks",
        "status",
        existing_type=sa.VARCHAR(length=50),
        type_=task_status,
        existing_nullable=False,
        schema="task",
        postgresql_using="status::task_status",
    )


def downgrade() -> None:
    """Downgrade schema."""

    task_status = sa.Enum(
        "todo",
        "in_progress",
        "done",
        name="task_status",
    )
    op.alter_column(
        "tasks",
        "status",
        existing_type=task_status,
        type_=sa.VARCHAR(length=50),
        existing_nullable=False,
        schema="task",
        postgresql_using="status::text",
    )
    task_status.drop(op.get_bind())
