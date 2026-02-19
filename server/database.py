import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize the database object
db = SQLAlchemy()
migrate = Migrate()

def setup_db(app):
    # Pulling credentials from your .env
    db_user = os.getenv('DB_USERNAME') or "root"
    db_pass = os.getenv('DB_PASSWORD') or "root_password_123"
    db_host = os.getenv('DB_HOST') or "db"  # Fallback to "db" if None
    db_name = os.getenv('DB_DATABASE') or "system_db"

    # Construct the MySQL Connection String
    # mysql+mysqlconnector://root:root_password_123@db/system_db
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{db_user}:{db_pass}@{db_host}/{db_name}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    
    # This line ensures the tables are created when the app starts
    with app.app_context():
        import models  # Important: Import models here to register them
        db.create_all()