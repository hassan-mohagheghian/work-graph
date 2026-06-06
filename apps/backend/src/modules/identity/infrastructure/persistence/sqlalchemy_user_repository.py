# src/modules/identity/infrastructure/persistence/sqlalchemy_user_repository.py

from sqlalchemy.future import select
from src.modules.identity.domain.entities.user import User
from src.modules.identity.infrastructure.persistence.models import UserModel
from src.modules.identity.domain.repositories.user_repository import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, user: User) -> None:
        """
        Map domain user -> persistence model
        Do NOT commit inside tests — rollback is handled by fixture
        """
        user_model = UserModel(
            id=user.id,
            email=user.email,
            username=user.username,
            display_name=user.display_name,
            password_hash=user.password_hash,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
        self.session.add(user_model)
        await self.session.commit()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        user_model = result.scalar_one_or_none()
        if user_model:
            return User(
                id=user_model.id,
                email=user_model.email,
                username=user_model.username,
                display_name=user_model.display_name,
                password_hash=user_model.password_hash,
                is_active=user_model.is_active,
                created_at=user_model.created_at,
                updated_at=user_model.updated_at,
            )
        return None
