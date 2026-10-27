from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from the environment (or a local .env). No secrets in code."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: Literal["development", "production", "test"] = "development"
    log_level: str = "INFO"

    # Comma-separated list of allowed browser origins
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # The SQLite database file, created on first start. A relative path is relative to the folder the API runs
    # from; the Docker image keeps it in its /data volume (sqlite:////data/sitesurelabs.db).
    database_url: str = "sqlite:///./sitesurelabs.db"

    # Abuse protection
    rate_limit_max: int = 5
    rate_limit_window_seconds: int = 600
    min_fill_seconds: float = 3.0
    require_business_email: bool = True
    trust_proxy_headers: bool = False  # only enable behind a proxy you control
    ip_hash_salt: str = "change-me"
    turnstile_secret_key: str | None = None  # enables Cloudflare Turnstile verification when set

    # Notifications (all optional; enquiries are always stored first)
    notify_to: str | None = None
    notify_from: str | None = None
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_starttls: bool = True
    webhook_url: str | None = None  # generic CRM / automation webhook (JSON POST)

    # Bearer token for GET /api/admin/enquiries. The endpoint is disabled when unset.
    admin_token: str | None = None

    @field_validator("database_url")
    @classmethod
    def _sqlite_only(cls, v: str) -> str:
        if not v.startswith(("sqlite:", "sqlite+")):
            raise ValueError("DATABASE_URL must be a SQLite URL, e.g. sqlite:///./sitesurelabs.db")
        return v

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
