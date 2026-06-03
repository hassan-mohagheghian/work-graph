from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.domain.entities.user import User
from src.modules.identity.domain.repositories import UserRepository


class RegisterUerHandler:
    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    async def handle(self, command: RegisterUserCommand) -> User:
        user = User.create(
            email=command.email,
            username=command.username,
            display_name=command.display_name,
            password_hash=command.password_hash,
        )
        await self.user_repo.add(user=user)
        return user
