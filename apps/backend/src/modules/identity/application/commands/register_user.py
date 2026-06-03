class RegisterUserCommand:
    def __init__(
        self,
        email: str,
        password_hash: str,
        display_name: str,
        username: str = None,
    ):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.display_name = display_name
