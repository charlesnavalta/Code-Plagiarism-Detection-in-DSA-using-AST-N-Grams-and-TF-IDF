import os
import time
import re
from flask import Flask, request, jsonify
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
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)

    # 1. Load configurations
    app.config.from_object('config.Config')

    # Allowed CORS origins pattern (Local dev + All Vercel domains + Render)
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://falsicode.vercel.app",
        re.compile(r"^https:\/\/.*\.vercel\.app$"),
        re.compile(r"^https:\/\/.*\.onrender\.com$")
    ]
    
    # Read CLIENT_URL or FRONTEND_URL from environment (support comma-separated values)
    client_env_urls = os.environ.get('CLIENT_URL') or os.environ.get('FRONTEND_URL')
    if client_env_urls:
        for url in client_env_urls.split(','):
            cleaned = url.strip().rstrip('/')
            if cleaned and cleaned not in allowed_origins:
                allowed_origins.append(cleaned)

    # Initialize CORS
    CORS(
        app,
        supports_credentials=True,
        origins=allowed_origins,
        allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials", "Origin", "Accept", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        expose_headers=["Content-Type", "Authorization"]
    )

    # Global fallback to ensure CORS headers on every response (including preflights & error responses)
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            origin = request.headers.get('Origin')
            if origin and ('.vercel.app' in origin or 'localhost' in origin or '127.0.0.1' in origin or '.onrender.com' in origin):
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Credentials, Origin, Accept, X-Requested-With'
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            return response

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if origin and ('.vercel.app' in origin or 'localhost' in origin or '127.0.0.1' in origin or '.onrender.com' in origin):
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Credentials, Origin, Accept, X-Requested-With'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        import traceback
        traceback.print_exc()
        code = getattr(e, 'code', 500)
        description = getattr(e, 'description', str(e))
        response = jsonify({"error": description, "details": str(e)})
        response.status_code = code if isinstance(code, int) and 100 <= code <= 599 else 500
        origin = request.headers.get('Origin')
        if origin and ('.vercel.app' in origin or 'localhost' in origin or '127.0.0.1' in origin or '.onrender.com' in origin):
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Access-Control-Allow-Credentials, Origin, Accept, X-Requested-With'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        return response

    # 2. Ensure Upload Folder Exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # 3. Initialize Extensions
    jwt = JWTManager(app) 
    setup_db(app)

    # 4. --- DATABASE INITIALIZATION & SEEDING ---
    with app.app_context():
        # Fast, non-blocking connection ping (max 3 retries, 1s sleep)
        retries = 3
        connected = False
        while retries > 0:
            try:
                db.session.execute(db.text('SELECT 1'))
                connected = True
                print("Falsicode: Database connected successfully!")
                
                # Auto-ensure resubmission_deadline column exists
                try:
                    with db.engine.connect() as conn:
                        conn.execute(db.text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS resubmission_deadline TIMESTAMP;"))
                        conn.commit()
                except Exception:
                    pass
                break
            except Exception as e:
                retries -= 1
                if retries > 0:
                    print(f"Falsicode: Database warming up... retrying ({3-retries}/3)")
                    time.sleep(1)
                else:
                    print(f"Falsicode: Database connection notice: {e}")
        
        # Only run auto-seeding if explicitly enabled via AUTO_SEED=true or SEED_ON_START=true
        auto_seed = os.environ.get('AUTO_SEED', 'false').lower() in ('true', '1', 't') or os.environ.get('SEED_ON_START', 'false').lower() in ('true', '1', 't')
        if connected and auto_seed:
            try:
                if User.query.count() == 0:
                    print("Falsicode: Empty database detected & AUTO_SEED enabled, running seeder...")
                    run_smart_seed(db)
                else:
                    print("Falsicode: Database already populated, skipping seeder.")
            except Exception as e:
                print(f"Falsicode Seeder Notice: {e}")

    # Add CLI seed command: `flask seed`
    @app.cli.command('seed')
    def seed_db():
        """Seeds the database with users, classrooms, assignments, and sample submissions."""
        with app.app_context():
            print("Falsicode CLI: Running Smart Seed...")
            run_smart_seed(db)
            print("Falsicode CLI: Smart Seed complete.")

    # 5. Base Route (Health Check)
    @app.route('/')
    def home():
        return {
            "status": "healthy",
            "service": "Falsicode Code Plagiarism Detection API",
            "message": "The system is running successfully!"
        }

    # 6. Register Blueprints
    app.register_blueprint(analysis_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(classrooms_bp, url_prefix='/api/classrooms')
    app.register_blueprint(assignments_bp, url_prefix='/api/classrooms')
    app.register_blueprint(submissions_bp, url_prefix='/api/classrooms')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    app.run(debug=debug, host='0.0.0.0', port=port)