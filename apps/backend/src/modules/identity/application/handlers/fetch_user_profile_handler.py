from src.modules.identity.domain.dtos.user_profile import UserProfile
from src.modules.identity.domain.repositories import UserRepository


class FetchUserProfileHandler:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def handle(self, email: str):
        user = await self.user_repo.get_by_email(email=email)
        if not user:
            return None
        return UserProfile(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
        )
