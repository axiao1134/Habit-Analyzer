from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = "sqlite:///./habits.db"
    
    # OpenRouter
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str = "qwen/qwen-2.5-72b-instruct"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # Site Attribution (for OpenRouter rankings)
    SITE_URL: str = "http://localhost:5173"
    SITE_NAME: str = "Habit Analyzer"
    
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "Habit Analyzer"
    SMTP_TLS: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()
