import os
from dotenv import load_dotenv

# Load environment variables from your .env file
load_dotenv()

# Get the absolute path of the directory this file is in
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base configuration class for the LogicGuard system."""
    
    # 1. Security Keys
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback_secret_key_for_dev')
    JWT_SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback_jwt_key') # Reusing secret key for JWT

    # 2. Database Setup (Constructing the URI from your .env variables)
    DB_USER = os.environ.get('DB_USERNAME', 'root')
    DB_PASS = os.environ.get('DB_PASSWORD', 'rootpassword')
    DB_HOST = os.environ.get('DB_HOST', 'db')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_NAME = os.environ.get('DB_DATABASE', 'system_db')
    
    # Format: mysql+pymysql://username:password@host:port/database_name
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 3. Application Specific Settings
    # This automatically sets your upload folder to server/uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    
    # Security: Prevent massive file uploads from crashing your server (Max 16 MB)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024