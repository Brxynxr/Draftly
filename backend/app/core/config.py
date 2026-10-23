from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Project metadata
    PROJECT_NAME: str = "Draftly API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"

    # Database (Supabase PostgreSQL / Neon)
    # Default to asyncpg url for async operations
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/draftly",
        description="Async PostgreSQL connection string (postgresql+asyncpg://...)",
    )

    # Security & JWT
    SECRET_KEY: str = Field(
        default="change-this-in-production-secret-key-32-chars-min",
        description="JWT encryption secret key",
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Mobile Webhook Integration (MacroDroid)
    GLOBAL_WEBHOOK_SECRET: str | None = Field(
        default=None,
        description="Optional shared server webhook secret. Each user also has a personal token.",
    )

    # =========================================================================
    # Multi-Provider AI Engine Configuration
    # Supported: "gemini", "groq", "openai", "ollama", "anthropic"
    # =========================================================================
    AI_PROVIDER: Literal["gemini", "groq", "openai", "ollama", "anthropic"] = Field(
        default="gemini",
        description="Primary AI provider to use across the platform",
    )

    # Model names per provider defaults
    AI_MODEL: str = Field(
        default="gemini-1.5-flash",
        description="Model identifier (e.g. 'gemini-1.5-flash', 'llama-3.3-70b-versatile', 'gpt-4o-mini')",
    )

    # API Keys (set only the ones you use)
    GEMINI_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None

    # Base URL for local models (e.g. Ollama http://localhost:11434/v1 or vLLM)
    AI_BASE_URL: str | None = Field(
        default=None,
        description="Base URL for OpenAI-compatible local models (e.g. http://localhost:11434/v1 for Ollama)",
    )


settings = Settings()
