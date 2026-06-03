from dataclasses import dataclass


@dataclass
class RegisterUserCommand:
    email: str
    password: str
    display_name: str
