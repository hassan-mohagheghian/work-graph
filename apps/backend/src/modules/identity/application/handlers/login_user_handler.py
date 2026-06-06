from src.modules.identity.application.dtos.login_result_dto import LoginResultDTO
from src.modules.identity.application.queries.login_user_query import LoginUserQuery
from src.modules.identity.domain.ports import PasswordHasher
from src.modules.identity.domain.ports.token_provider import TokenProvider
from src.modules.identity.domain.repositories import UserRepository
from src.modules.identity.infrastructure.persistence.models import UserModel


class LoginUserHandler:
    def __init__(
        self,
        user_repo: UserRepository,
        password_hasher: PasswordHasher,
        token_provider: TokenProvider,
    ):
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.token_provider = token_provider

    async def handle(self, query: LoginUserQuery) -> LoginResultDTO:
        user: UserModel | None = await self.user_repo.get_by_email(query.email)
        if not user:
            raise ValueError("Invalid credentials")
        if not self.password_hasher.verify(
            password=query.password, hashed=user.password_hash
        ):
            raise ValueError("Invalid credentials")
        token = self.token_provider.generate_token(str(user.id))
        return LoginResultDTO(access_token=token)
