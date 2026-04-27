import os
import time
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy.exc import OperationalError

# Database and Models
from database import setup_db, db 
from models import User, Classroom, Assignment 

# Import the Seeder Logic
from seeder import run_smart_seed

# Blueprints (Controllers)
from routes.analysis import analysis_bp
from routes.auth import auth_bp
from routes.classrooms import classrooms_bp
from routes.assignments import assignments_bp
from routes.submissions import submissions_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # 1. Load configurations
    app.config.from_object('config.Config')

    # 2. Ensure Upload Folder Exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # 3. Initialize Extensions
    jwt = JWTManager(app) 
    setup_db(app)

    # 4. --- DATABASE INITIALIZATION & SEEDING ---
    with app.app_context():
        print("Falsicode: Checking database connection...")
        
        retries = 10
        connected = False
        while retries > 0:
            try:
                # 🌟 THE FIX: Add db.drop_all() right before create_all()
                print("Falsicode: Dropping old tables to reset schema...")
                db.drop_all() 
                
                print("Falsicode: Creating new tables with updated schema...")
                db.create_all() 
                
                connected = True
                break
            except (OperationalError, Exception) as e:
                retries -= 1
                print(f"Falsicode: Database not ready... retrying in 3s ({10-retries}/10). Error: {e}")
                time.sleep(3)
        
        if connected:
            # Trigger the smart seeder
            run_smart_seed(db)
        else:
            print("CRITICAL: Falsicode could not connect to database.")

    # 5. Base Route
    @app.route('/')
    def home():
        return {"status": "The Falsicode System is Running Successfully!"}

    # 6. Register Blueprints
    app.register_blueprint(analysis_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(classrooms_bp, url_prefix='/api/classrooms')
    app.register_blueprint(assignments_bp, url_prefix='/api/classrooms')
    app.register_blueprint(submissions_bp, url_prefix='/api/classrooms')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)