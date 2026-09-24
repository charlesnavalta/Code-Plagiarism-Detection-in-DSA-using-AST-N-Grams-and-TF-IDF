from flask import Blueprint, request, jsonify
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from database import db
from models import User, Classroom, Enrollment, Assignment, Submission
from utils.file_manager import cleanup_classroom_files
from flask_jwt_extended import jwt_required, get_jwt_identity

# This Blueprint handles Classroom logic
classrooms_bp = Blueprint('classrooms', __name__)

# Classroom capacity limit: maximum 50 students per classroom
MAX_STUDENTS_PER_CLASSROOM = 50

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

    # Fetch all classrooms with student counts in a single aggregated query
    results = db.session.query(
        Classroom,
        func.count(Enrollment.id).label('student_count')
    ).outerjoin(
        Enrollment, Classroom.id == Enrollment.classroom_id
    ).filter(
        Classroom.instructor_id == user.id
    ).group_by(Classroom.id).all()
    
    class_list = [{
        "id": c.id, 
        "name": c.name, 
        "invite_code": c.invite_code,
        "student_count": student_count,
        "max_students": MAX_STUDENTS_PER_CLASSROOM
    } for c, student_count in results]
        
    return jsonify(class_list), 200

@classrooms_bp.route('/<int:class_id>', methods=['GET'])
@jwt_required()
def get_classroom(class_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role == 'instructor':
        classroom = Classroom.query.options(
            joinedload(Classroom.instructor)
        ).filter_by(id=class_id, instructor_id=user.id).first()
    elif user.role == 'student':
        enrollment = Enrollment.query.options(
            joinedload(Enrollment.classroom).joinedload(Classroom.instructor)
        ).filter_by(student_id=user.id, classroom_id=class_id).first()
        classroom = enrollment.classroom if enrollment else None
    else:
        return jsonify({"error": "Unauthorized"}), 403

    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    student_count = Enrollment.query.filter_by(classroom_id=classroom.id).count()

    return jsonify({
        "id": classroom.id,
        "name": classroom.name,
        "invite_code": classroom.invite_code,
        "instructor": classroom.instructor.username if classroom.instructor else "Unknown",
        "student_count": student_count,
        "max_students": MAX_STUDENTS_PER_CLASSROOM
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

    # Enforce maximum student capacity (50 students)
    current_student_count = Enrollment.query.filter_by(classroom_id=classroom.id).count()
    if current_student_count >= MAX_STUDENTS_PER_CLASSROOM:
        return jsonify({
            "error": f"Classroom is full. Maximum limit of {MAX_STUDENTS_PER_CLASSROOM} students has been reached."
        }), 400

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

    # Eager load both classroom and instructor in 1 single JOIN
    enrollments = Enrollment.query.options(
        joinedload(Enrollment.classroom).joinedload(Classroom.instructor)
    ).filter_by(student_id=user.id).all()

    class_list = [{
        "id": e.classroom.id, 
        "name": e.classroom.name, 
        "instructor": e.classroom.instructor.username if e.classroom.instructor else "Unknown",
        "instructor_avatar": getattr(e.classroom.instructor, 'avatar_url', None) if e.classroom.instructor else None
    } for e in enrollments if e.classroom]
    
    return jsonify(class_list), 200

# ==============================================================================
# CLASSROOM SETTINGS & ROSTER MANAGEMENT (Instructor CRUD & Student Actions)
# ==============================================================================

@classrooms_bp.route('/<int:class_id>', methods=['PUT'])
@jwt_required()
def update_classroom(class_id):
    """Allows instructors to update classroom details (e.g. name)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied."}), 404

    data = request.get_json() or {}
    new_name = data.get('name', '').strip()

    if not new_name:
        return jsonify({"error": "Classroom name cannot be empty."}), 400

    if len(new_name) > 100:
        return jsonify({"error": "Classroom name cannot exceed 100 characters."}), 400

    classroom.name = new_name
    try:
        db.session.commit()
        return jsonify({
            "message": "Classroom updated successfully!",
            "classroom": {
                "id": classroom.id,
                "name": classroom.name,
                "invite_code": classroom.invite_code
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update classroom."}), 500


@classrooms_bp.route('/<int:class_id>/regenerate-code', methods=['POST'])
@jwt_required()
def regenerate_invite_code(class_id):
    """Allows instructors to roll a new 6-character invite code."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied."}), 404

    new_code = classroom.generate_invite_code()
    classroom.invite_code = new_code

    try:
        db.session.commit()
        return jsonify({
            "message": f"New invite code generated: {new_code}",
            "invite_code": new_code
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to regenerate invite code."}), 500


@classrooms_bp.route('/<int:class_id>', methods=['DELETE'])
@jwt_required()
def delete_classroom(class_id):
    """Allows instructors to permanently delete a classroom and all associated records."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied."}), 404

    class_name = classroom.name
    try:
        cleanup_classroom_files(class_id)
        db.session.delete(classroom)
        db.session.commit()
        return jsonify({
            "message": f"Classroom '{class_name}' and all associated assignments and submissions were permanently deleted."
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete classroom: {str(e)}"}), 500


@classrooms_bp.route('/<int:class_id>/roster', methods=['GET'])
@jwt_required()
def get_classroom_roster(class_id):
    """Returns the enrolled student roster with progress statistics for instructors."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied."}), 404

    enrollments = Enrollment.query.options(
        joinedload(Enrollment.student)
    ).filter_by(classroom_id=classroom.id).all()

    # Get total assignments for this classroom
    classroom_assignments = Assignment.query.filter_by(classroom_id=classroom.id).all()
    total_assignments = len(classroom_assignments)
    assignment_ids = [a.id for a in classroom_assignments]

    students_data = []
    for enr in enrollments:
        if not enr.student:
            continue

        completed_count = 0
        if assignment_ids:
            completed_count = db.session.query(
                func.count(func.distinct(Submission.assignment_id))
            ).filter(
                Submission.student_id == enr.student.id,
                Submission.assignment_id.in_(assignment_ids)
            ).scalar() or 0

        students_data.append({
            "id": enr.student.id,
            "username": enr.student.username,
            "email": enr.student.email,
            "avatar_url": getattr(enr.student, 'avatar_url', None),
            "enrolled_at": enr.enrolled_at.isoformat() if enr.enrolled_at else None,
            "completed_assignments": completed_count
        })

    # Sort students alphabetically by username
    students_data.sort(key=lambda s: s['username'].lower())

    return jsonify({
        "classroom_id": classroom.id,
        "classroom_name": classroom.name,
        "invite_code": classroom.invite_code,
        "total_students": len(students_data),
        "max_students": MAX_STUDENTS_PER_CLASSROOM,
        "total_assignments": total_assignments,
        "students": students_data
    }), 200


@classrooms_bp.route('/<int:class_id>/students/<int:student_id>', methods=['DELETE'])
@jwt_required()
def remove_student_from_classroom(class_id, student_id):
    """Allows instructors to remove / kick a student from their classroom."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied."}), 404

    enrollment = Enrollment.query.filter_by(classroom_id=classroom.id, student_id=student_id).first()
    if not enrollment:
        return jsonify({"error": "Student is not enrolled in this classroom."}), 404

    try:
        db.session.delete(enrollment)
        db.session.commit()
        return jsonify({"message": "Student removed from classroom successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to remove student from classroom."}), 500


@classrooms_bp.route('/<int:class_id>/leave', methods=['POST'])
@jwt_required()
def leave_classroom(class_id):
    """Allows an enrolled student to leave / unenroll from the classroom."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"error": "Only students can unenroll from classrooms."}), 403

    enrollment = Enrollment.query.filter_by(classroom_id=class_id, student_id=user.id).first()
    if not enrollment:
        return jsonify({"error": "You are not enrolled in this classroom."}), 404

    classroom = Classroom.query.get(class_id)
    class_name = classroom.name if classroom else "Classroom"

    try:
        db.session.delete(enrollment)
        db.session.commit()
        return jsonify({"message": f"You have left {class_name} successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to leave classroom."}), 500


@classrooms_bp.route('/<int:class_id>/classmates', methods=['GET'])
@jwt_required()
def get_classroom_classmates(class_id):
    """
    Privacy-safe read-only endpoint for students to view their classmates in the section.
    Exposes only usernames and enrollment dates to confirm section membership.
    Grades, submissions, and plagiarism similarity percentages are strictly hidden.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"error": "Unauthorized"}), 403

    # Ensure the requesting student is actually enrolled in this classroom
    user_enrollment = Enrollment.query.filter_by(classroom_id=class_id, student_id=user.id).first()
    if not user_enrollment:
        return jsonify({"error": "You are not enrolled in this classroom."}), 403

    classroom = Classroom.query.get(class_id)
    if not classroom:
        return jsonify({"error": "Classroom not found."}), 404

    enrollments = Enrollment.query.options(
        joinedload(Enrollment.student)
    ).filter_by(classroom_id=class_id).all()

    classmates = []
    for enr in enrollments:
        if not enr.student:
            continue
        classmates.append({
            "id": enr.student.id,
            "username": enr.student.username,
            "avatar_url": getattr(enr.student, 'avatar_url', None),
            "enrolled_at": enr.enrolled_at.isoformat() if enr.enrolled_at else None,
            "is_you": enr.student.id == user.id
        })

    # Sort so the current student is at the top, then alphabetically
    classmates.sort(key=lambda c: (not c['is_you'], c['username'].lower()))

    return jsonify({
        "classroom_id": classroom.id,
        "classroom_name": classroom.name,
        "total_classmates": len(classmates),
        "max_students": MAX_STUDENTS_PER_CLASSROOM,
        "classmates": classmates
    }), 200