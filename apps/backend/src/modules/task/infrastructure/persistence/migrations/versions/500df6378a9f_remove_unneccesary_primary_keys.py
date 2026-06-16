"""remove unneccesary primary_keys

Revision ID: 500df6378a9f
Revises: afadc65ede63
Create Date: 2026-06-16 20:12:38.270815

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "500df6378a9f"
down_revision: Union[str, Sequence[str], None] = "afadc65ede63"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Drop composite primary key
    op.drop_constraint(
        "tasks_pkey",
        "tasks",
        schema="task",
        type_="primary",
    )

    # 2. Re-create primary key on id (IMPORTANT)
    op.create_primary_key(
        "tasks_pkey",
        "tasks",
        ["id"],
        schema="task",
    )

    # 3. Ensure columns are NOT PK anymore (optional but explicit)
    op.alter_column(
        "tasks",
        "project_id",
        existing_type=sa.UUID(),
        nullable=False,
        schema="task",
    )

    op.alter_column(
        "tasks",
        "org_id",
        existing_type=sa.UUID(),
        nullable=False,
        schema="task",
    )


def downgrade() -> None:
    """Downgrade schema."""
    # 1. Drop new primary key (id)
    op.drop_constraint(
        "tasks_pkey",
        "tasks",
        schema="task",
        type_="primary",
    )

    # 2. Restore composite primary key
    op.create_primary_key(
        "tasks_pkey",
        "tasks",
        ["project_id", "org_id", "id"],
        schema="task",
    )
