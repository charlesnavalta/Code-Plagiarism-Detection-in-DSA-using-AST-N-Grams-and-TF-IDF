import re
from flask import Blueprint, request, jsonify
from database import db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from utils.email_service import generate_6_digit_code, send_otp_email

auth_bp = Blueprint('auth', __name__)

# Strict email regex requiring user@domain.tld
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

def is_valid_email_format(email_str):
    """Validates email format strictly to prevent slow SMTP timeouts on malformed addresses."""
    if not email_str or not isinstance(email_str, str):
        return False
    email_str = email_str.strip().lower()
    if len(email_str) < 5 or len(email_str) > 254:
        return False
    if not EMAIL_REGEX.match(email_str):
        return False
    parts = email_str.split('@')
    if len(parts) != 2:
        return False
    domain = parts[1]
    if '.' not in domain or domain.startswith('.') or domain.endswith('.'):
        return False
    tld = domain.split('.')[-1]
    if len(tld) < 2:
        return False
    return True

# In-memory store for pending registration OTPs: { email: { "code": "123456", "expires": datetime } }
PENDING_REGISTRATIONS = {}
PENDING_EMAIL_UPDATES = {}

# ==============================================================================
# NEW: REQUEST VERIFICATION CODE (Called before registration)
# ==============================================================================
@auth_bp.route('/request-code', methods=['POST'])
def request_code():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400

        email = (data.get('email') or '').strip().lower()

        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not is_valid_email_format(email):
            return jsonify({"error": "Invalid email format. Please enter a valid email address (e.g. name@gmail.com or user@example.com)."}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "This email address is already registered. Please log in or use Forgot Password."}), 400

        code = generate_6_digit_code()
        
        # Attempts real email dispatch (Resend API or Gmail SMTP)
        email_sent, err_detail = send_otp_email(email, code, intent="registration")
        
        if email_sent:
            PENDING_REGISTRATIONS[email] = {
                "code": code,
                "expires": datetime.utcnow() + timedelta(minutes=15)
            }
            return jsonify({"message": "Verification code sent to your email inbox. Please check your email.", "email_sent": True}), 200
        else:
            return jsonify({
                "error": f"Failed to send email to {email}: {err_detail}. Please verify your email settings in server/.env."
            }), 500
            
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
    if not data:
        return jsonify({"error": "JSON body is required"}), 400

    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    code = str(data.get('code') or '').strip()
    
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required fields."}), 400

    if not is_valid_email_format(email):
        return jsonify({"error": "Invalid email format. Please enter a valid email address (e.g. name@gmail.com or user@example.com)."}), 400

    if not code:
        return jsonify({"error": "Please enter the 6-digit verification code sent to your email."}), 400

    pending_entry = PENDING_REGISTRATIONS.get(email)
    if not pending_entry or str(pending_entry.get("code")).strip() != code:
        return jsonify({"error": "Invalid verification code. Please check the 6-digit code received in your email or request a new one."}), 400

    if datetime.utcnow() > pending_entry.get("expires"):
        PENDING_REGISTRATIONS.pop(email, None)
        return jsonify({"error": "Verification code has expired. Please request a new code."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email address is already registered."}), 400

    if User.query.filter(User.username.ilike(username)).first():
        return jsonify({"error": "This username is already taken. Please choose another."}), 400
    
    # Verification passed! Consume pending registration entry
    PENDING_REGISTRATIONS.pop(email, None)

    requested_role = data.get('role', 'student')
    if requested_role not in ['student', 'instructor']:
        requested_role = 'student'

    user_status = 'pending' if requested_role == 'instructor' else 'active'
    
    new_user = User(
        username=username,
        email=email,
        role=requested_role,
        status=user_status
    )
    new_user.set_password(password)
    new_user.is_verified = True
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration Successful!", "status": user_status}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred during registration: " + str(e)}), 500


# ==============================================================================
# 2. VERIFICATION ENDPOINT (Validates the 6-digit OTP)
# ==============================================================================
@auth_bp.route('/verify', methods=['POST'])
def verify_otp():
    """Validates the 6-digit code sent to the user's email."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body is required"}), 400

    email = (data.get('email') or '').strip().lower()
    code = str(data.get('code') or '').strip()
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
        
    if user.is_verified:
        return jsonify({"message": "Account is already verified. You may log in."}), 200

    if str(user.verification_code).strip() != code:
        return jsonify({"error": "Invalid verification code."}), 400
        
    if user.verification_expires and datetime.utcnow() > user.verification_expires:
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
        
        login_id = (data.get('username') or data.get('email') or '').strip()
        password = data.get('password')

        if not login_id or not password:
            return jsonify({"error": "Username/Email and password are required."}), 400

        # Fast lookup matching email or username
        user = User.query.filter(
            (User.email == login_id.lower()) | 
            (User.username == login_id) |
            (User.username.ilike(login_id))
        ).first()

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
                    "first_name": getattr(user, 'first_name', ''),
                    "last_name": getattr(user, 'last_name', '')
                }
            }), 200

        return jsonify({"error": "Invalid email/username or password"}), 401
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
    if not data:
        return jsonify({"error": "JSON body is required"}), 400

    login_id = (data.get('email') or data.get('username') or '').strip()

    if not login_id:
        return jsonify({"error": "Email or Username is required."}), 400

    user = User.query.filter(
        (User.email == login_id.lower()) | 
        (User.username == login_id) |
        (User.username.ilike(login_id))
    ).first()
    
    if not user:
        return jsonify({"message": "If the account is valid, a recovery code has been sent to your email.", "email_sent": True}), 200

    try:
        code = generate_6_digit_code()
        
        user.verification_code = code
        user.verification_expires = datetime.utcnow() + timedelta(minutes=15)
        db.session.commit()

        email_sent, err_detail = send_otp_email(user.email, code, intent="password_update")
        
        if email_sent:
            return jsonify({"message": "If the account is valid, a recovery code has been sent to your email inbox.", "email_sent": True}), 200
        else:
            return jsonify({
                "error": f"Failed to deliver recovery email: {err_detail}. Please verify your email settings in server/.env."
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "A system fault occurred while generating recovery keys: " + str(e)}), 500


# ==============================================================================
# 🌟 RESET PASSWORD ENDPOINT (Supports both Username and Email lookup)
# ==============================================================================
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Validates verification code and commits the new password configuration."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body is required"}), 400

    login_id = (data.get('email') or data.get('username') or '').strip()
    code = str(data.get('code') or '').strip()
    new_password = (data.get('new_password') or data.get('newPassword') or data.get('password') or '').strip()

    if not login_id or not code or not new_password:
        return jsonify({"error": "Email/Username, verification code, and new password are all required."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    user = User.query.filter(
        (User.email == login_id.lower()) | 
        (User.username == login_id) |
        (User.username.ilike(login_id))
    ).first()
    
    if not user:
        return jsonify({"error": "No account matches the provided identifier."}), 400

    if not user.verification_code or str(user.verification_code).strip() != code:
        return jsonify({"error": "Invalid verification code. Please check the code and try again."}), 400

    if user.verification_expires and datetime.utcnow() > user.verification_expires:
        return jsonify({"error": "Verification code has expired. Please request a new code."}), 400

    try:
        user.set_password(new_password)
        user.verification_code = None
        user.verification_expires = None
        db.session.commit()
        return jsonify({"message": "Password updated successfully! You may now log in."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update password: " + str(e)}), 500

# ... (Admin and Profile routes remain exactly the same) ...

# ==============================================================================
# 4. ADMIN USER MANAGEMENT ROUTES (Protect with @jwt_required)
# ==============================================================================
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    raw_identity = get_jwt_identity()
    user_id = int(raw_identity) if str(raw_identity).isdigit() else raw_identity
    current_user = User.query.get(user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    # Fast column projection without hydrating complete ORM objects
    users = db.session.query(
        User.id,
        User.username,
        User.email,
        User.role,
        User.status,
        User.is_verified
    ).order_by(User.id.asc()).all()

    users_data = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "status": u.status,
        "is_verified": u.is_verified 
    } for u in users]
        
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
            return jsonify({"message": "Security authorization code sent to your email inbox.", "email_sent": True}), 200
        else:
            return jsonify({
                "error": f"Failed to send security code: {err_detail}. Please verify your email settings in server/.env."
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred: " + str(e)}), 500


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


@auth_bp.route('/profile/request-email-update', methods=['POST'])
@jwt_required()
def request_email_update():
    """Generates and sends an OTP to a new email address after verifying user password."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json() or {}
    new_email = (data.get('new_email') or '').strip().lower()
    password = (data.get('password') or '').strip()

    if not is_valid_email_format(new_email):
        return jsonify({"error": "Invalid email format. Please enter a valid email address (e.g. name@gmail.com or user@example.com)."}), 400

    if not password:
        return jsonify({"error": "Current password is required to request an email change."}), 400

    if not user.check_password(password):
        return jsonify({"error": "Security protocol failed: Current password is incorrect."}), 403

    if user.email and user.email.lower() == new_email:
        return jsonify({"error": "The specified address is already your current registered email."}), 400

    existing = User.query.filter_by(email=new_email).first()
    if existing and existing.id != user.id:
        return jsonify({"error": "This email address is already registered to another account."}), 400

    try:
        code = generate_6_digit_code()
        
        email_sent, err_detail = send_otp_email(new_email, code, intent="email_update")
        
        if email_sent:
            PENDING_EMAIL_UPDATES[user.id] = {
                "new_email": new_email,
                "code": code,
                "expires": datetime.utcnow() + timedelta(minutes=10)
            }
            return jsonify({
                "message": f"Verification code dispatched to {new_email}. Please check your inbox.",
                "email_sent": True
            }), 200
        else:
            return jsonify({
                "error": f"Failed to send verification email: {err_detail}. Please verify your email settings in server/.env."
            }), 500

    except Exception as e:
        return jsonify({"error": "Failed to process email update request: " + str(e)}), 500


@auth_bp.route('/profile/update-email', methods=['PUT'])
@jwt_required()
def update_email():
    """Validates the OTP and updates the user's email address."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json() or {}
    code = str(data.get('code') or '').strip()

    if not code:
        return jsonify({"error": "Verification code is required."}), 400

    pending = PENDING_EMAIL_UPDATES.get(user.id)
    if not pending:
        return jsonify({"error": "No pending email change request found. Please request a new code."}), 400

    if pending.get('expires') and datetime.utcnow() > pending['expires']:
        PENDING_EMAIL_UPDATES.pop(user.id, None)
        return jsonify({"error": "Verification code has expired. Please request a new one."}), 400

    if str(pending.get('code')).strip() != code:
        return jsonify({"error": "Security protocol failed: Invalid verification code."}), 400

    new_email = pending.get('new_email')
    if not new_email:
        return jsonify({"error": "Invalid email state. Please restart the update process."}), 400

    # Final check for race condition
    existing = User.query.filter_by(email=new_email).first()
    if existing and existing.id != user.id:
        PENDING_EMAIL_UPDATES.pop(user.id, None)
        return jsonify({"error": "This email address was claimed by another user."}), 400

    try:
        user.email = new_email
        db.session.commit()
        PENDING_EMAIL_UPDATES.pop(user.id, None)
        
        user_dict = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
        return jsonify({
            "message": "Contact email updated successfully!",
            "user": user_dict
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error while updating email: " + str(e)}), 500