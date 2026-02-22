from flask import Blueprint, request, jsonify
from database import db
from models import User
# IMPORTANT: Added jwt_required and get_jwt_identity for the Admin routes
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

# ==========================================
# 1. REGISTRATION ENDPOINT
# ==========================================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 1.1 Validate required fields
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # 1.2 SECURITY FIX: Ensure no one can inject the 'admin' role through the API.
    # We force the role to either 'student' or 'instructor'.
    requested_role = data.get('role', 'student')
    if requested_role not in ['student', 'instructor']:
        requested_role = 'student'

    # 1.3 NEW LOGIC: Determine if the account needs Admin approval
    user_status = 'pending' if requested_role == 'instructor' else 'active'
    
    # 1.4 Create user with the validated role and status
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

# ==========================================
# 2. LOGIN ENDPOINT
# ==========================================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # 2.1 Flexible lookup: check by email or username
    login_id = data.get('username') or data.get('email')
    password = data.get('password')

    user = User.query.filter((User.email == login_id) | (User.username == login_id)).first()

    # 2.2 Verify credentials
    if user and user.check_password(password):
        # 2.3 SECURITY FIX: Block login if the instructor is still 'pending'
        if user.status == 'pending':
            return jsonify({"error": "Account pending Admin approval. Please check back later."}), 403

        # 2.4 If they are 'active', generate the token and log them in
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

# ==========================================
# 3. ADMIN ROUTES FOR USER MANAGEMENT
# ==========================================
@auth_bp.route('/users', methods=['GET'])
@jwt_required() # Protects route: Requires a valid JWT to access
def get_all_users():
    # 3.1 Identify who is requesting the data
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # 3.2 Security Check: Block access if the user is not an Admin
    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    # 3.3 Fetch all users from the database
    users = User.query.all()
    
    # 3.4 Format the data to send back to the React table
    users_data = []
    for u in users:
        users_data.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "status": u.status
        })
        
    return jsonify(users_data), 200

@auth_bp.route('/users/<int:user_id>/approve', methods=['PATCH'])
@jwt_required()
def approve_user(user_id):
    # 4.1 Identify who is trying to approve the account
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # 4.2 Security Check: Only admins can approve accounts
    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    # 4.3 Find the user they are trying to approve
    user_to_approve = User.query.get(user_id)
    if not user_to_approve:
        return jsonify({"error": "User not found"}), 404

    # 4.4 Make sure we only approve pending instructors
    if user_to_approve.role != 'instructor' or user_to_approve.status != 'pending':
        return jsonify({"error": "This user does not require approval"}), 400

    # 4.5 Flip the status to active and save to the database
    user_to_approve.status = 'active'
    
    try:
        db.session.commit()
        return jsonify({"message": f"Instructor {user_to_approve.username} approved successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500

from flask_jwt_extended import jwt_required, get_jwt_identity
# Make sure jwt_required and get_jwt_identity are imported at the top!

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Allows a logged-in user to update their password"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    try:
        # Uses the set_password method you already wrote in models.py to hash it!
        user.set_password(new_password)
        db.session.commit()
        return jsonify({"message": "Password updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred."}), 500