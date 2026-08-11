from flask import Blueprint, request, jsonify
from database import db
from models import User, Classroom, Enrollment
from flask_jwt_extended import jwt_required, get_jwt_identity

# This Blueprint now ONLY handles Classroom logic
classrooms_bp = Blueprint('classrooms', __name__)

@classrooms_bp.route('/', methods=['POST'])
@jwt_required()
def create_classroom():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized. Only instructors can create classes."}), 403

    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Classroom name is required."}), 400

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
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    # Fetch all classrooms owned by this instructor
    classes = Classroom.query.filter_by(instructor_id=user.id).all()
    
    class_list = []
    for c in classes:
        # 🌟 THE FIX: Count the number of enrollments for this specific classroom
        student_count = Enrollment.query.filter_by(classroom_id=c.id).count()
        
        class_list.append({
            "id": c.id, 
            "name": c.name, 
            "invite_code": c.invite_code,
            "student_count": student_count  # 🌟 Inject the count into the JSON payload
        })
        
    return jsonify(class_list), 200

@classrooms_bp.route('/<int:class_id>', methods=['GET'])
@jwt_required()
def get_classroom(class_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    elif user.role == 'student':
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
        "instructor": classroom.instructor.username 
    }), 200

@classrooms_bp.route('/join', methods=['POST'])
@jwt_required()
def join_classroom():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"error": "Only students can join classrooms."}), 403

    data = request.get_json()
    invite_code = data.get('invite_code')

    if not invite_code:
        return jsonify({"error": "Invite code is required."}), 400

    classroom = Classroom.query.filter_by(invite_code=invite_code.upper()).first()
    if not classroom:
        return jsonify({"error": "Invalid invite code. Classroom not found."}), 404

    existing_enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=classroom.id).first()
    if existing_enrollment:
        return jsonify({"error": "You are already enrolled in this classroom."}), 400

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
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"error": "Unauthorized"}), 403

    enrollments = Enrollment.query.filter_by(student_id=user.id).all()
    class_list = [{
        "id": e.classroom.id, 
        "name": e.classroom.name, 
        "instructor": e.classroom.instructor.username 
    } for e in enrollments]
    
    return jsonify(class_list), 200