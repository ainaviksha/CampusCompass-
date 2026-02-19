from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Naviksha Master Engineering API"
    MONGODB_URL: str
    SECRET_KEY: str = "dev_secret_key_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week for dev
    TWOFACTOR_API_KEY: str = ""
    TWOFACTOR_OTP_TEMPLATE: str = "NavikshaOTP"

    class Config:
        env_file = ".env"

settings = Settings()
