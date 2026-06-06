from dataclasses import dataclass


@dataclass
class LoginResultDTO:
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600  # seconds = 1 hour
