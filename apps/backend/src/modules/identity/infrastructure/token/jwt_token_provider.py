import jwt
import datetime

from src.modules.identity.domain.ports.token_provider import TokenProvider


class JWTTokenProvider(TokenProvider):
    def __init__(self, secret_key: str, expires_in: int = 3600):
        self.secret_key = secret_key
        self.expires_in = expires_in

    def generate_token(self, user_id: str) -> str:
        payload = {
            "sub": user_id,
            "exp": datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(seconds=self.expires_in),
        }
        return jwt.encode(payload, self.secret_key, algorithm="HS256")
