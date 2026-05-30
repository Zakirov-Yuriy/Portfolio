from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # CORS
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Почта (Brevo HTTP API — работает там, где хостинг режет SMTP-порты)
    owner_email: str = "zakirov.yuriy86@gmail.com"          # куда приходят заявки
    brevo_api_key: str = ""                                  # ключ Brevo
    brevo_sender_email: str = "zakirov.yuriy86@gmail.com"    # верифицированный отправитель
    brevo_sender_name: str = "Юрий Закиров"

    # SMTP оставлено для локальной отправки (на Render не используется)
    smtp_from: str = "zakirov.yuriy86@gmail.com"
    smtp_host: str = ""
    smtp_port: int = 465
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_ssl: bool = True

    # LLM (OpenRouter)
    openrouter_api_key: str = ""
    openrouter_api_key_backup: str = ""
    llm_model: str = "openai/gpt-oss-120b:free"

    @field_validator("*", mode="before")
    @classmethod
    def _strip_strings(cls, value: object) -> object:
        # Срезаем пробелы и переводы строк у значений из окружения,
        # чтобы случайный \n в ключе не ломал HTTP-заголовки.
        return value.strip() if isinstance(value, str) else value

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def email_dry_run(self) -> bool:
        # Нет ключа Brevo — письма не отправляются, а логируются.
        return not self.brevo_api_key


@lru_cache
def get_settings() -> Settings:
    return Settings()