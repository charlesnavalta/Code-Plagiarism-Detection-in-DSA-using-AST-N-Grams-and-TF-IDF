from flask import Blueprint, request, jsonify
from database import db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from utils.email_service import generate_6_digit_code, send_otp_email

auth_bp = Blueprint('auth', __name__)

# ==============================================================================
# NEW: REQUEST VERIFICATION CODE (Called before registration)
# ==============================================================================
@auth_bp.route('/request-code', methods=['POST'])
def request_code():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400

        email = data.get('email')

        if not email:
            return jsonify({"error": "Email is required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400

        code = generate_6_digit_code()
        
        # Falls back to intent="registration" automatically
        email_sent, err_detail = send_otp_email(email, code)
        
        if email_sent:
            return jsonify({"message": "Verification code sent!", "code": code}), 200
        else:
            return jsonify({"error": f"Failed to send verification email: {err_detail}"}), 500
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to process request: " + str(e)}), 500
    
# ==============================================================================
# 1. REGISTRATION ENDPOINT
# ==============================================================================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    requested_role = data.get('role', 'student')
    if requested_role not in ['student', 'instructor']:
        requested_role = 'student'

    user_status = 'pending' if requested_role == 'instructor' else 'active'
    
    # 🌟 FIX: Removed first_name/last_name to prevent the 500 DB schema crash
    new_user = User(
        username=data['username'],
        email=data['email'],
        role=requested_role,
        status=user_status
    )
    new_user.set_password(data['password'])
    
    new_user.is_verified = True
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration Successful!", "status": user_status}), 201
    except Exception as e:
        db.session.rollback()
        # You can print(e) here in development to see exact DB errors in your terminal
        return jsonify({"error": "An error occurred during registration."}), 500


# ==============================================================================
# 2. VERIFICATION ENDPOINT (Validates the 6-digit OTP)
# ==============================================================================
@auth_bp.route('/verify', methods=['POST'])
def verify_otp():
    """Validates the 6-digit code sent to the user's email."""
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
        
    if user.is_verified:
        return jsonify({"message": "Account is already verified. You may log in."}), 200

    if user.verification_code != code:
        return jsonify({"error": "Invalid verification code."}), 400
        
    if datetime.utcnow() > user.verification_expires:
        return jsonify({"error": "Verification code has expired. Please request a new one."}), 400
        
    try:
        user.is_verified = True
        user.verification_code = None
        user.verification_expires = None
        db.session.commit()
        return jsonify({"message": "Account successfully verified! You may now log in."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error during verification."}), 500


# ==============================================================================
# 3. LOGIN ENDPOINT (Authenticates & checks verification status)
# ==============================================================================
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request. JSON body expected."}), 400
        
        login_id = data.get('username') or data.get('email')
        password = data.get('password')

        if not login_id or not password:
            return jsonify({"error": "Username/Email and password are required."}), 400

        user = User.query.filter((User.email == login_id) | (User.username == login_id)).first()

        if user and user.check_password(password):
            if not user.is_verified:
                return jsonify({"error": "Please verify your email address before logging in."}), 403

            if user.status == 'pending':
                return jsonify({"error": "Account pending Admin approval. Please check back later."}), 403

            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    # Safe fallback: Won't crash if the columns don't exist
                    "first_name": getattr(user, 'first_name', ''),
                    "last_name": getattr(user, 'last_name', '')
                }
            }), 200

        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Authentication error: {str(e)}"}), 500


# ==============================================================================
# 🌟 FORGOT PASSWORD ENDPOINT (Supports both Username and Email lookup)
# ==============================================================================
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Initializes the verification code process for account recovery."""
    data = request.get_json()
    login_id = data.get('email') 

    if not login_id:
        return jsonify({"error": "An identifier field is required."}), 400

    user = User.query.filter((User.email == login_id) | (User.username == login_id)).first()
    
    if not user:
        return jsonify({"message": "If the account is valid, a recovery code has been sent."}), 200

    try:
        code = generate_6_digit_code()
        
        user.verification_code = code
        user.verification_expires = datetime.utcnow() + timedelta(minutes=15)
        db.session.commit()

        email_sent, err_detail = send_otp_email(user.email, code, intent="password_update")
        
        if email_sent:
            return jsonify({"message": "If the account is valid, a recovery code has been sent."}), 200
        else:
            return jsonify({"error": f"Failed to send recovery email: {err_detail}"}), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "A system fault occurred while generating recovery keys."}), 500


# ==============================================================================
# 🌟 RESET PASSWORD ENDPOINT (Supports both Username and Email lookup)
# ==============================================================================
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Validates verification code and commits the new password configuration."""
    data = request.get_json()
    login_id = data.get('email') 
    code = data.get('code')
    new_password = data.get('new_password')

    if not login_id or not code or not new_password:
        return jsonify({"error": "All execution inputs are strictly required."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Security parameter failed: Password must be at least 6 characters."}), 400

    user = User.query.filter((User.email == login_id) | (User.username == login_id)).first()
    if not user:
        return jsonify({"error": "Verification sequence invalid."}), 400

    if user.verification_code != code:
        return jsonify({"error": "Invalid code parameters provided."}), 400

    if user.verification_expires and datetime.utcnow() > user.verification_expires:
        return jsonify({"error": "Verification matrix has expired. Request a new sequence."}), 400

    try:
        user.set_password(new_password)
        user.verification_code = None
        user.verification_expires = None
        db.session.commit()
        return jsonify({"message": "Credentials updated successfully! Proceeding to entry portal."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to commit credential updates to database architecture."}), 500

# ... (Admin and Profile routes remain exactly the same) ...

# ==============================================================================
# 4. ADMIN USER MANAGEMENT ROUTES (Protect with @jwt_required)
# ==============================================================================
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    users = User.query.all()
    users_data = []
    for u in users:
        users_data.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "status": u.status,
            "is_verified": u.is_verified 
        })
        
    return jsonify(users_data), 200

@auth_bp.route('/users/<int:user_id>/approve', methods=['PATCH'])
@jwt_required()
def approve_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    user_to_approve = User.query.get(user_id)
    if not user_to_approve:
        return jsonify({"error": "User not found"}), 404

    if user_to_approve.role != 'instructor' or user_to_approve.status != 'pending':
        return jsonify({"error": "This user does not require approval"}), 400

    user_to_approve.status = 'active'
    
    try:
        db.session.commit()
        return jsonify({"message": f"Instructor {user_to_approve.username} approved successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


# ==============================================================================
# 5. ADMIN CRUD: CREATE, UPDATE, DELETE
# ==============================================================================
@auth_bp.route('/users', methods=['POST'])
@jwt_required()
def admin_create_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
        
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'student'),
        status=data.get('status', 'active')
    )
    new_user.set_password(data['password'])
    
    new_user.is_verified = True 
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User provisioned successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def admin_update_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    user_to_update = User.query.get(user_id)
    if not user_to_update:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    if 'email' in data and data['email'] != user_to_update.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email is already in use by another account"}), 400
            
    if 'username' in data and data['username'] != user_to_update.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username is already taken"}), 400

    user_to_update.username = data.get('username', user_to_update.username)
    user_to_update.email = data.get('email', user_to_update.email)
    user_to_update.role = data.get('role', user_to_update.role)
    user_to_update.status = data.get('status', user_to_update.status) 

    if 'password' in data and len(data['password']) >= 6:
        user_to_update.set_password(data['password'])

    try:
        db.session.commit()
        return jsonify({"message": "User parameters updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    user_to_delete = User.query.get(user_id)
    if not user_to_delete:
        return jsonify({"error": "User not found"}), 404
        
    if user_to_delete.id == current_user.id:
        return jsonify({"error": "System restriction: You cannot delete the active admin account."}), 403

    try:
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"message": "User node permanently purged."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database constraint error. User may have active dependencies."}), 500
    

# ==============================================================================
# 6. PROFILE MANAGEMENT & SECURITY
# ==============================================================================
@auth_bp.route('/profile/request-code', methods=['POST'])
@jwt_required()
def request_profile_code():
    """Generates and sends an OTP to a logged-in user for security changes."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found."}), 404

    try:
        code = generate_6_digit_code()
        
        user.verification_code = code
        user.verification_expires = datetime.utcnow() + timedelta(minutes=10)
        db.session.commit()

        email_sent, err_detail = send_otp_email(user.email, code, intent="password_update")
        
        if email_sent:
            return jsonify({"message": "Security code sent to your email!"}), 200
        else:
            return jsonify({"error": f"Failed to send security code: {err_detail}"}), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred."}), 500


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Updates the password after verifying the current password and OTP."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    code = data.get('code')

    if not current_password or not new_password or not code:
        return jsonify({"error": "All fields (current password, new password, and code) are required."}), 400

    if not user.check_password(current_password):
        return jsonify({"error": "Security protocol failed: Current password is incorrect."}), 403

    if user.verification_code != code:
        return jsonify({"error": "Security protocol failed: Invalid verification code."}), 400

    if user.verification_expires and datetime.utcnow() > user.verification_expires:
        return jsonify({"error": "Verification code has expired. Please request a new one."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters long."}), 400

    try:
        user.set_password(new_password)
        user.verification_code = None
        user.verification_expires = None
        db.session.commit()
        return jsonify({"message": "Security credentials updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred."}), 500