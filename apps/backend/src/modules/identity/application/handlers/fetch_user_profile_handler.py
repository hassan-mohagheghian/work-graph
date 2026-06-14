from uuid import UUID

from src.modules.identity.application.dtos import UserProfile
from src.modules.identity.domain.repositories import UserRepository


class FetchUserProfileHandler:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def handle(self, id: UUID):
        user = await self.user_repo.get_by_id(id=id)
        if not user:
            return None
        return UserProfile(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
        )
