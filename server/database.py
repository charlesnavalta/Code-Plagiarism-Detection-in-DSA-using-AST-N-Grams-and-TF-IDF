import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize the database and migration objects
db = SQLAlchemy()
migrate = Migrate()

def setup_db(app):
    """Initializes SQLAlchemy and Flask-Migrate with the app configuration."""
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Ensure tables are created when the app starts
    with app.app_context():
        try:
            import models  # Important: Import models here to register them
            db.create_all()
        except Exception as e:
            print(f"Falsicode DB Init Notice: {e}")