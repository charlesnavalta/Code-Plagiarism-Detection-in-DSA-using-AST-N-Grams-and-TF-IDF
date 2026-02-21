import os
import ast
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission
from flask_jwt_extended import jwt_required, get_jwt_identity

classrooms_bp = Blueprint('classrooms', __name__)

@classrooms_bp.route('/', methods=['POST'])
@jwt_required()
def create_classroom():
    # 1. Identify who is asking
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # 2. Security Check: Only instructors can create classes
    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized. Only instructors can create classes."}), 403

    # 3. Get the class name from the React frontend
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Classroom name is required."}), 400

    # 4. Create the classroom (the 6-character code generates automatically!)
    new_class = Classroom(name=data['name'], instructor_id=user.id)
    
    try:
        db.session.add(new_class)
        db.session.commit()
        return jsonify({
            "message": "Classroom created successfully!",
            "classroom": {
                "id": new_class.id,
                "name": new_class.name,
                "invite_code": new_class.invite_code
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


@classrooms_bp.route('/', methods=['GET'])
@jwt_required()
def get_instructor_classrooms():
    """Fetches all classrooms created by this specific instructor"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    # Fetch only the classes belonging to this instructor
    classes = Classroom.query.filter_by(instructor_id=user.id).all()
    
    class_list = [{"id": c.id, "name": c.name, "invite_code": c.invite_code} for c in classes]
    return jsonify(class_list), 200 


@classrooms_bp.route('/<int:class_id>', methods=['GET'])
@jwt_required()
def get_classroom(class_id):
    """Fetches details for a single classroom for both instructors and enrolled students"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role == 'instructor':
        # Instructors can only view classes they created
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    elif user.role == 'student':
        # Students can only view classes they are enrolled in
        enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
        classroom = enrollment.classroom if enrollment else None
    else:
        return jsonify({"error": "Unauthorized"}), 403

    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    return jsonify({
        "id": classroom.id,
        "name": classroom.name,
        "invite_code": classroom.invite_code,
        "instructor": classroom.instructor.username # Gives the student the teacher's name!
    }), 200


# ==========================================
# ASSIGNMENT ROUTES
# ==========================================

@classrooms_bp.route('/<int:class_id>/assignments', methods=['POST'])
@jwt_required()
def create_assignment(class_id):
    """Allows an instructor to create an assignment in a specific classroom"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    # 1. Verify this classroom actually belongs to this instructor
    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    # 2. Get the assignment details from React
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({"error": "Assignment title is required."}), 400

    # 3. Save to database
    new_assignment = Assignment(
        title=data['title'],
        description=data.get('description', ''), # Description is optional
        classroom_id=classroom.id
    )
    
    try:
        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({
            "message": "Assignment created successfully!",
            "assignment": {
                "id": new_assignment.id,
                "title": new_assignment.title,
                "description": new_assignment.description
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


@classrooms_bp.route('/<int:class_id>/assignments', methods=['GET'])
@jwt_required()
def get_assignments(class_id):
    """Fetches all assignments for a specific classroom"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # Use the same RBAC security check as above
    if user.role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    elif user.role == 'student':
        enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
        classroom = enrollment.classroom if enrollment else None
    else:
        return jsonify({"error": "Unauthorized"}), 403

    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    assignments = Assignment.query.filter_by(classroom_id=class_id).all()
    
    assignments_data = [{
        "id": a.id,
        "title": a.title,
        "description": a.description
    } for a in assignments]
    
    return jsonify(assignments_data), 200


# ==========================================
# STUDENT ROUTES
# ==========================================

@classrooms_bp.route('/join', methods=['POST'])
@jwt_required()
def join_classroom():
    """Allows a student to join a classroom using the 6-character invite code"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"error": "Only students can join classrooms."}), 403

    data = request.get_json()
    invite_code = data.get('invite_code')

    if not invite_code:
        return jsonify({"error": "Invite code is required."}), 400

    # 1. Find the classroom by the code
    classroom = Classroom.query.filter_by(invite_code=invite_code.upper()).first()
    if not classroom:
        return jsonify({"error": "Invalid invite code. Classroom not found."}), 404

    # 2. Check if the student is already enrolled
    existing_enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=classroom.id).first()
    if existing_enrollment:
        return jsonify({"error": "You are already enrolled in this classroom."}), 400

    # 3. Enroll the student
    new_enrollment = Enrollment(student_id=user.id, classroom_id=classroom.id)
    
    try:
        db.session.add(new_enrollment)
        db.session.commit()
        return jsonify({
            "message": f"Successfully joined {classroom.name}!",
            "classroom": {"id": classroom.id, "name": classroom.name}
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


@classrooms_bp.route('/enrolled', methods=['GET'])
@jwt_required()
def get_enrolled_classrooms():
    """Fetches all classrooms a student is enrolled in"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"error": "Unauthorized"}), 403

    # Fetch all enrollments for this student, and get the associated classroom data
    enrollments = Enrollment.query.filter_by(student_id=user.id).all()
    
    class_list = [{
        "id": e.classroom.id, 
        "name": e.classroom.name, 
        "instructor": e.classroom.instructor.username # Because we set up db.relationship earlier!
    } for e in enrollments]
    
    return jsonify(class_list), 200


# ==========================================
# SUBMISSION ROUTES
# ==========================================

@classrooms_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assignment(class_id, assignment_id):
    """Allows a student to upload a .py file with AST validation"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role != 'student':
        return jsonify({"error": "Only students can submit assignments."}), 403

    # 1. Verify the student is enrolled in this class
    enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
    if not enrollment:
        return jsonify({"error": "You are not enrolled in this class."}), 403

    # 2. Verify the assignment belongs to this class
    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found."}), 404

    # 3. Handle the File Upload
    if 'file' not in request.files:
        return jsonify({"error": "No file part detected."}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
        
    # Strictly enforce that only Python files are uploaded
    if not file.filename.endswith('.py'):
        return jsonify({"error": "Invalid format. Only .py files are allowed."}), 400

    # ==========================================
    # AST SYNTAX CHECKING BLOCK
    # ==========================================
    try:
        # Read the file to check its contents
        file_content = file.read().decode('utf-8')
        
        # Try to build the AST tree. If the syntax is broken, this will fail!
        ast.parse(file_content)
        
        # CRITICAL: Reset the file reading pointer back to the beginning!
        file.seek(0) 
        
    except SyntaxError as e:
        # If they missed a colon or broke an indentation, reject it safely!
        return jsonify({"error": f"Upload rejected! Syntax error on line {e.lineno}: {e.msg}"}), 400
    except Exception as e:
        return jsonify({"error": f"Upload rejected! Invalid Python file: {str(e)}"}), 400
    # ==========================================

    # Sanitize the filename to prevent malicious directory traversal attacks
    original_filename = secure_filename(file.filename)
    
    # Create a unique filename so "main.py" doesn't overwrite someone else's "main.py"
    unique_filename = f"student_{user.id}_assign_{assignment.id}_{original_filename}"
    
    # Save the file to the uploads folder
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)

    # 4. Save the record to the database
    existing_submission = Submission.query.filter_by(student_id=user.id, assignment_id=assignment.id).first()
    
    try:
        if existing_submission:
            existing_submission.file_path = filepath
            existing_submission.filename = original_filename
            existing_submission.submitted_at = db.func.current_timestamp()
        else:
            new_submission = Submission(
                assignment_id=assignment.id,
                student_id=user.id,
                filename=original_filename,
                file_path=filepath
            )
            db.session.add(new_submission)
            
        db.session.commit()
        return jsonify({"message": "Python file submitted successfully!"}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error saving submission: {e}")
        return jsonify({"error": "Database error occurred while saving submission."}), 500