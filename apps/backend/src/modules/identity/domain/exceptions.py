class AuthenticationError(Exception):
    """Base auth error"""

    pass


class InvalidCredentialsError(AuthenticationError):
    """Raised when email or password is incorrect"""

    pass


class UserAlreadyExistsError(AuthenticationError):
    """Raised when registering with an existing email"""

    pass
