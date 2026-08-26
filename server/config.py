import os
from dotenv import load_dotenv

# Get the absolute path of the directory this file is in
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Explicitly load environment variables from server/.env or project root .env
load_dotenv(os.path.join(BASE_DIR, '.env'))
load_dotenv(os.path.join(os.path.dirname(BASE_DIR), '.env'))
load_dotenv()

def get_database_uri():
    """Constructs the database URI, prioritizing DATABASE_URL for cloud providers like Aiven."""
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        # Aiven & standard MySQL connection string fix: mysql:// -> mysql+pymysql://
        if db_url.startswith('mysql://'):
            db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)
        elif db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://', 1)
        
        # Aiven appends ?ssl-mode=REQUIRED which causes PyMySQL kwargs errors; clean it safely
        db_url = db_url.replace('?ssl-mode=REQUIRED', '').replace('&ssl-mode=REQUIRED', '')
        db_url = db_url.replace('?ssl_mode=REQUIRED', '').replace('&ssl_mode=REQUIRED', '')
        return db_url

    # Fallback to individual variables for Docker / local development
    db_user = os.environ.get('DB_USERNAME', 'root')
    db_pass = os.environ.get('DB_PASSWORD', 'rootpassword')
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_port = os.environ.get('DB_PORT', '3306')
    db_name = os.environ.get('DB_DATABASE', 'system_db')

    return f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

class Config:
    """Base configuration class for the Falsicode system."""
    
    # 1. Security Keys
    SECRET_KEY = os.environ.get('SECRET_KEY', 'falsicode_fallback_secret_key_2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)

    # 2. Database Setup
    SQLALCHEMY_DATABASE_URI = get_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cloud database resilience: automatically check and recycle dropped connections, with sane pool sizes and timeouts
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 280,
        "pool_pre_ping": True,
        "pool_size": 10,
        "max_overflow": 20,
        "pool_timeout": 15,
        "connect_args": {
            "connect_timeout": 10
        }
    }

    # 3. Application Specific Settings
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'uploads'))
    
    # Security: Prevent massive file uploads (Max 16 MB)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024