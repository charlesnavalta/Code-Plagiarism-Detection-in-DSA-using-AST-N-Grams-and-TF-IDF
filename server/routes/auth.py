from flask import Blueprint, request, jsonify
from database import db
from models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 1. Validate required fields
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # SECURITY FIX: Ensure no one can inject the 'admin' role through the API.
    # We force the role to either 'student' or 'instructor'.
    requested_role = data.get('role', 'student')
    if requested_role not in ['student', 'instructor']:
        requested_role = 'student'

    # NEW LOGIC: Determine if the account needs Admin approval
    user_status = 'pending' if requested_role == 'instructor' else 'active'
    
    # 2. Create user with the validated role and status
    new_user = User(
        username=data['username'],
        email=data['email'],
        role=requested_role,
        status=user_status
    )
    new_user.set_password(data['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
        # Return the status so React can show the correct popup alert
        return jsonify({"message": "User created successfully", "status": user_status}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # 3. Flexible lookup: check by email or username
    login_id = data.get('username') or data.get('email')
    password = data.get('password')

    user = User.query.filter((User.email == login_id) | (User.username == login_id)).first()

    # 4. Verify credentials
    if user and user.check_password(password):
        # SECURITY FIX: Block login if the instructor is still 'pending'
        if user.status == 'pending':
            return jsonify({"error": "Account pending Admin approval. Please check back later."}), 403

        # If they are 'active', generate the token and log them in
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role # Critical for your Navigate logic in App.js
            }
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401