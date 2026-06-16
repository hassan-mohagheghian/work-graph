from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Apps
    APP_NAME: str = "WorkGraph"
    ENV: str = "dev"
    debug: bool = True

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/workgraph"
    )

    # Security
    JWT_SECRET: str = "sdfkj3l4j200()&*^&23jkjfkdfkjfkjwekr&*372jkjfkdf"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 60 * 24

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
