from dotenv import load_dotenv
import os

# Load environment variables before any other logic runs
load_dotenv()

from flask import Flask
from flask_cors import CORS
from database import setup_db, db # Ensure 'db' is imported here
from models import User, Classroom, Assignment # Import your User model for the seeding logic
from routes.analysis import analysis_bp
from routes.auth import auth_bp
from flask_jwt_extended import JWTManager
from routes.classrooms import classrooms_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route('/')
    def home():
        return {"status": "The System is Running Successfully!"}

    # Configuration
    app.config['UPLOAD_FOLDER'] = 'uploads'
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY') 
    jwt = JWTManager(app) 

    # Initialize Database (MySQL Connection)
    setup_db(app)

    # --- AUTOMATIC ADMIN SEEDING LOGIC ---
    # We must use app.app_context() to interact with the database before the server fully starts
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
            new_admin.set_password('admin123') # The requested password
            
            db.session.add(new_admin)
            db.session.commit()
            print("Master Admin account created successfully!")
    # --- END SEEDING LOGIC ---

    # Register Blueprints (The "Controllers")
    app.register_blueprint(analysis_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(classrooms_bp, url_prefix='/api/classrooms')

    return app

app = create_app()

if __name__ == '__main__':
    # host='0.0.0.0' is required for Docker to allow external access
    app.run(debug=True, host='0.0.0.0', port=5000)