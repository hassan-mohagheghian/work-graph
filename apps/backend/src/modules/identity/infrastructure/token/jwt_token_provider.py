import datetime

import jwt
from src.modules.identity.domain.ports.token_provider import TokenProvider
from src.shared.config.settings import settings


class JWTTokenProvider(TokenProvider):
    def __init__(
        self,
        secret_key: str,
        algorithm: str,
        expires_in: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    ):
        self.secret_key = secret_key
        self.expires_in = expires_in
        self.algorithm = algorithm

    def generate_token(self, user_id: str) -> str:
        payload = {
            "sub": user_id,
            "exp": datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(seconds=self.expires_in),
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
