"""create knowledge tables

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2026-06-25 12:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

link_target_type = sa.Enum(
    "project", "task", name="link_target_type", schema="knowledge"
)


def upgrade() -> None:
    op.execute("CREATE SCHEMA IF NOT EXISTS knowledge")

    op.create_table(
        "documents",
        sa.Column("org_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("created_by", sa.UUID(), nullable=True),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        schema="knowledge",
    )
    op.create_index(
        op.f("ix_knowledge_documents_org_id"),
        "documents",
        ["org_id"],
        unique=False,
        schema="knowledge",
    )

    op.create_table(
        "document_links",
        sa.Column("org_id", sa.UUID(), nullable=False),
        sa.Column("document_id", sa.UUID(), nullable=False),
        sa.Column("target_type", link_target_type, nullable=False),
        sa.Column("target_id", sa.UUID(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["knowledge.documents.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "document_id",
            "target_type",
            "target_id",
            name="uq_document_link_target",
        ),
        schema="knowledge",
    )
    op.create_index(
        op.f("ix_knowledge_document_links_org_id"),
        "document_links",
        ["org_id"],
        unique=False,
        schema="knowledge",
    )

    op.create_table(
        "attachments",
        sa.Column("org_id", sa.UUID(), nullable=False),
        sa.Column("document_id", sa.UUID(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=127), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("storage_key", sa.String(length=512), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["knowledge.documents.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        schema="knowledge",
    )
    op.create_index(
        op.f("ix_knowledge_attachments_org_id"),
        "attachments",
        ["org_id"],
        unique=False,
        schema="knowledge",
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_knowledge_attachments_org_id"),
        table_name="attachments",
        schema="knowledge",
    )
    op.drop_table("attachments", schema="knowledge")
    op.drop_index(
        op.f("ix_knowledge_document_links_org_id"),
        table_name="document_links",
        schema="knowledge",
    )
    op.drop_table("document_links", schema="knowledge")
    op.drop_index(
        op.f("ix_knowledge_documents_org_id"),
        table_name="documents",
        schema="knowledge",
    )
    op.drop_table("documents", schema="knowledge")
    link_target_type.drop(op.get_bind(), checkfirst=True)
