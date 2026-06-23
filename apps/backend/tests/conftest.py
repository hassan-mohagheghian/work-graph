import asyncpg
import pytest
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool
from src.modules.identity.domain.repositories.user_repository import UserRepository
from src.modules.identity.infrastructure.persistence.models import Base as IdentityBase
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.modules.organization.infrastructure.persistence.models import Base as OrgBase
from src.modules.project.infrastructure.persistence.models import Base as ProjectBase
from src.modules.task.infrastructure.persistence.models import Base as TaskBase

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/workgraph_test"
ADMIN_DB_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
SCHEMAS = ["identity", "org", "project", "task"]


async def ensure_test_db():
    """
    Connects to the default 'postgres' database and creates the test database if missing.
    """
    db_name = "workgraph_test"

    conn = await asyncpg.connect(ADMIN_DB_URL)
    try:
        result = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname=$1", db_name
        )
        if not result:
            await conn.execute(f'CREATE DATABASE "{db_name}"')
            print(f"✅ Database '{db_name}' created.")
        else:
            print(f"ℹ️ Database '{db_name}' already exists.")

    finally:
        await conn.close()


@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    await ensure_test_db()


@pytest.fixture(scope="session")
async def engine():
    """
    Creates an async SQLAlchemy engine, ensures schemas exist,
    and creates all tables for the test database.
    """
    engine = create_async_engine(DATABASE_URL, echo=False, poolclass=NullPool)

    async with engine.begin() as conn:
        # ✅ Ensure all required schemas exist
        for schema in SCHEMAS:
            await conn.execute(sa.text(f'CREATE SCHEMA IF NOT EXISTS "{schema}"'))

        # ✅ Create all tables in metadata
        await conn.run_sync(IdentityBase.metadata.create_all)
        await conn.run_sync(OrgBase.metadata.create_all)
        await conn.run_sync(ProjectBase.metadata.create_all)
        await conn.run_sync(TaskBase.metadata.create_all)

    yield engine

    # Teardown: drop tables and schemas after all tests
    async with engine.begin() as conn:
        await conn.run_sync(IdentityBase.metadata.drop_all)
        await conn.run_sync(OrgBase.metadata.drop_all)
        for schema in SCHEMAS:
            await conn.execute(sa.text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))

    await engine.dispose()


@pytest.fixture
async def async_session(engine):

    SessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with SessionLocal() as session:
        yield session
        await session.rollback()


@pytest.fixture
async def user_repo(async_session) -> UserRepository:
    return SQLAlchemyUserRepository(session=async_session)
