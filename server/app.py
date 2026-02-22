import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Database and Models
from database import setup_db, db 
from models import User, Classroom, Assignment 

# Blueprints (Controllers)
from routes.analysis import analysis_bp
from routes.auth import auth_bp
from routes.classrooms import classrooms_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # 1. Load all configurations from config.py
    app.config.from_object('config.Config')

    # 2. Ensure Upload Folder Exists before anything runs
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # 3. Initialize Extensions
    jwt = JWTManager(app) 
    setup_db(app)

    # 4. Base Route
    @app.route('/')
    def home():
        return {"status": "The LogicGuard System is Running Successfully!"}

    # 5. --- AUTOMATIC ADMIN SEEDING LOGIC ---
    # We use app.app_context() to interact with the database before the server fully starts
    with app.app_context():
        db.create_all() # Ensures tables exist
        
        # Check if the Master Admin is already in the database
        admin_user = User.query.filter_by(email='admin@test.com').first()
        
        if not admin_user:
            print("No admin found. Creating default Master Admin...")
            new_admin = User(
                username='admin',
                email='admin@test.com',
                role='admin',
                status='active' # Admins are immediately active
            )
            new_admin.set_password('admin123') 
            
            db.session.add(new_admin)
            db.session.commit()
            print("Master Admin account created successfully!")
    # --- END SEEDING LOGIC ---

    # 6. Register Blueprints (The "Controllers")
    app.register_blueprint(analysis_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(classrooms_bp, url_prefix='/api/classrooms')

    return app

# Initialize the application
app = create_app()

if __name__ == '__main__':
    # host='0.0.0.0' is required for Docker to allow external access
    app.run(debug=True, host='0.0.0.0', port=5000)