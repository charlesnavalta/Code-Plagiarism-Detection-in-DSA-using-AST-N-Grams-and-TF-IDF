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

# ==========================================
# 4. ADMIN CRUD: CREATE USER
# ==========================================
@auth_bp.route('/users', methods=['POST'])
@jwt_required()
def admin_create_user():
    """Allows an Admin to manually create a user with a specific status."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # 4.1 Security Check: Only admins can do this
    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    data = request.get_json()
    
    # 4.2 Validation
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
        
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 400

    # 4.3 Create the user (Admins bypass the 'pending' rule if they want)
    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'student'),
        status=data.get('status', 'active') # Explicitly grab status from React
    )
    new_user.set_password(data['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User provisioned successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


# ==========================================
# 5. ADMIN CRUD: UPDATE USER
# ==========================================
@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def admin_update_user(user_id):
    """Allows an Admin to modify a user's role, status, email, or password."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # 5.1 Security Check
    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    # 5.2 Find User
    user_to_update = User.query.get(user_id)
    if not user_to_update:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    # 5.3 Prevent Duplicate Emails/Usernames (excluding current user's own data)
    if 'email' in data and data['email'] != user_to_update.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email is already in use by another account"}), 400
            
    if 'username' in data and data['username'] != user_to_update.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username is already taken"}), 400

    # 5.4 Apply Updates from React payload
    user_to_update.username = data.get('username', user_to_update.username)
    user_to_update.email = data.get('email', user_to_update.email)
    user_to_update.role = data.get('role', user_to_update.role)
    user_to_update.status = data.get('status', user_to_update.status) # Catch the status change!

    # 5.5 Optional Password Update
    if 'password' in data and len(data['password']) >= 6:
        user_to_update.set_password(data['password'])

    try:
        db.session.commit()
        return jsonify({"message": "User parameters updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


# ==========================================
# 6. ADMIN CRUD: DELETE USER
# ==========================================
@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_user(user_id):
    """Allows an Admin to permanently delete a user."""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    user_to_delete = User.query.get(user_id)
    if not user_to_delete:
        return jsonify({"error": "User not found"}), 404
        
    # Prevent the admin from deleting themselves
    if user_to_delete.id == current_user.id:
        return jsonify({"error": "System restriction: You cannot delete the active admin account."}), 403

    try:
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"message": "User node permanently purged."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database constraint error. User may have active dependencies."}), 500
    
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