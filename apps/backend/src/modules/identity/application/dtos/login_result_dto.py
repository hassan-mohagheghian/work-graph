from dataclasses import dataclass

from src.config.settings import settings


@dataclass
class LoginResultDTO:
    access_token: str
    token_type: str = "bearer"
    expires_in: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES
