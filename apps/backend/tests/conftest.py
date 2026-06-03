import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.config.database import AsyncSessionLocal


@pytest.fixture
async def user_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyUserRepository(session=session)
