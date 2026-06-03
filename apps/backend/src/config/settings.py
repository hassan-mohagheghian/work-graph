from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "WorkGraph"
    debug: bool = True


settings = Settings()
