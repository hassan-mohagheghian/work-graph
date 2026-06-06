import asyncio

import asyncpg
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool
from src.modules.identity.domain.repositories.user_repository import UserRepository
from src.modules.identity.infrastructure.persistence.models import Base
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/workgraph_test"
ADMIN_DB_URL = "postgresql://postgres:postgres@localhost:5432/postgres"


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


asyncio.run(ensure_test_db())


@pytest.fixture()
async def engine():
    engine = create_async_engine(DATABASE_URL, echo=False, poolclass=NullPool)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

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
