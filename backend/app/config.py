from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # CORS
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Почта
    owner_email: str = "zakirov.yuriy86@gmail.com"
    smtp_from: str = "zakirov.yuriy86@gmail.com"
    smtp_host: str = ""
    smtp_port: int = 465
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_ssl: bool = True

    # LLM (OpenRouter вместо Claude)
    openrouter_api_key: str = ""
    openrouter_api_key_backup: str = ""
    llm_model: str = "openai/gpt-oss-120b:free"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def email_dry_run(self) -> bool:
        # Без SMTP-хоста письма не отправляются, а логируются.
        return not self.smtp_host


@lru_cache
def get_settings() -> Settings:
    return Settings()
