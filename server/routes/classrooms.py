from flask import Blueprint, request, jsonify
from database import db
from models import User, Classroom, Assignment
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
    """Fetches details for a single classroom"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    # Find the classroom and ensure this instructor actually owns it
    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    return jsonify({
        "id": classroom.id,
        "name": classroom.name,
        "invite_code": classroom.invite_code
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

    # Security check: Ensure the instructor asking actually owns this classroom
    if user.role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
        if not classroom:
            return jsonify({"error": "Classroom not found or access denied"}), 404

    # Fetch all assignments linked to this class ID
    assignments = Assignment.query.filter_by(classroom_id=class_id).all()
    
    assignments_data = [{
        "id": a.id,
        "title": a.title,
        "description": a.description
    } for a in assignments]
    
    return jsonify(assignments_data), 200