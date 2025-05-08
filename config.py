import os

class Config:
    DB_USER = 'mcan'
    DB_PASSWORD = ''
    DB_NAME = 'test'
    DB_HOST = 'localhost'
    SECRET_KEY = 'your-secret-key-here'

    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    JWT_SECRET = os.getenv("JWT_SECRET", "your-secure-key-here")
    JWT_EXPIRATION = int(os.getenv("JWT_EXPIRATION", 86400))
    DB_DSN = os.getenv("DB_DSN", "postgres://user:pass@localhost/dbname")
    DB_POOL_MIN = int(os.getenv("DB_POOL_MIN", 1))
    DB_POOL_MAX = int(os.getenv("DB_POOL_MAX", 5))
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    WORKERS = int(os.getenv("WORKERS", 1))


'''
class Config:
    # Use environment variables for all sensitive/configurable values
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database configuration
    DB_DSN = os.getenv("DATABASE_URL",  # Match docker-compose environment name
        f"postgres://{os.getenv('DB_USER', 'user')}:{os.getenv('DB_PASSWORD', 'password')}"
        f"@{os.getenv('DB_HOST', 'localhost')}:5432/{os.getenv('DB_NAME', 'notalone')}"
    )
    
    # JWT configuration
    JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-please-change-in-prod")
    JWT_EXPIRATION = int(os.getenv("JWT_EXPIRATION", 86400))  # 24 hours
    
    # Server configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    WORKERS = int(os.getenv("WORKERS", 1))
    
    # Connection pool settings
    DB_POOL_MIN = int(os.getenv("DB_POOL_MIN", 1))
    DB_POOL_MAX = int(os.getenv("DB_POOL_MAX", 5))
'''