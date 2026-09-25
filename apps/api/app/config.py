import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_NAME: str = "SurakshaAI"
    APP_VERSION: str = "1.0.0"

    # Database (Supabase / PostgreSQL or local SQLite)
    DATABASE_URL: str = "sqlite:///./surakshaai.db"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Redis & Vector
    REDIS_URL: str = "redis://localhost:6379/0"
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION_REPORTS: str = "suraksha_reports"
    QDRANT_COLLECTION_KNOWLEDGE: str = "suraksha_knowledge"

    # Storage
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "suraksha-documents"
    STORAGE_LOCAL_DIR: str = "./storage"

    # Artificial Intelligence Engine — Exclusively OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    DEFAULT_MODEL_PROVIDER: str = "openai"

    # Security
    JWT_SECRET: str = "surakshaai_development_jwt_secret_key_production_389274982374"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    SESSION_SECRET: str = "surakshaai_development_session_secret_key_847392817491"
    UPLOAD_MAX_MB: int = 50

    # Contacts
    SUPPORT_EMAIL: str = "hse-support@suraksha.ai"
    SECURITY_EMAIL: str = "security@suraksha.ai"
    GENERAL_CONTACT_EMAIL: str = "contact@suraksha.ai"

    API_PORT: int = 8000
    WEB_PORT: int = 3000

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
