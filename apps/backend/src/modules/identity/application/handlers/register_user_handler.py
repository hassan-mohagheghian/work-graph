from src.modules.identity.domain.services.password_hasher import PasswordHasher
from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.domain.entities.user import User
from src.modules.identity.domain.repositories import UserRepository


class RegisterUerHandler:
    def __init__(
        self, user_repo: UserRepository, password_hasher: PasswordHasher
    ) -> None:
        self.user_repo = user_repo
        self.password_hasher = password_hasher

    async def handle(self, command: RegisterUserCommand) -> User:

        hashed_password = self.password_hasher.hash(password=command.password)
        user = User.create(
            email=command.email,
            display_name=command.display_name,
            password_hash=hashed_password,
        )
        await self.user_repo.add(user=user)
        return user
