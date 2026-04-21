from flask import Blueprint, request, jsonify
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission
from flask_jwt_extended import jwt_required, get_jwt_identity

# Create a dedicated Blueprint for assignments
assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/<int:class_id>/assignments', methods=['POST'])
@jwt_required()
def create_assignment(class_id):
    """Allows an instructor to create an assignment in a specific classroom"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({"error": "Assignment title is required."}), 400

    new_assignment = Assignment(
        title=data['title'],
        description=data.get('description', ''),
        max_score=data.get('max_score', 100),
        classroom_id=classroom.id,
        # 🌟 NEW: Capture the language from the request (default to python if missing)
        language=data.get('language', 'python').lower()
    )
    
    try:
        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({
            "message": "Assignment created successfully!",
            "assignment": {
                "id": new_assignment.id,
                "title": new_assignment.title,
                "description": new_assignment.description,
                "max_score": new_assignment.max_score,
                "language": new_assignment.language # 🌟 Include in response
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred"}), 500


@assignments_bp.route('/<int:class_id>/assignments', methods=['GET'])
@jwt_required()
def get_assignments(class_id):
    """Fetches all assignments and attaches the student's submission status (One-Time Lock)"""
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

    assignments = Assignment.query.filter_by(classroom_id=class_id).all()
    
    assignments_data = []
    for a in assignments:
        assignment_info = {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "max_score": a.max_score,
            "language": a.language, # 🌟 NEW: Expose language to the frontend
            "has_submitted": False,
            "score": None
        }

        # The new check: If student, see if they already uploaded a file
        if user.role == 'student':
            submission = Submission.query.filter_by(assignment_id=a.id, student_id=user.id).first()
            if submission:
                assignment_info["has_submitted"] = True
                assignment_info["score"] = getattr(submission, 'score', 'Pending')
                
        assignments_data.append(assignment_info)
        
    return jsonify(assignments_data), 200