import os
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission, AssignmentAttachment
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

def verify_admin():
    """Helper to check if current JWT belongs to an active admin"""
    raw_identity = get_jwt_identity()
    user_id = int(raw_identity) if str(raw_identity).isdigit() else raw_identity
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return None
    return user

# ==========================================
# 1. SYSTEM-WIDE STATS
# ==========================================
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    try:
        total_students = User.query.filter_by(role='student').count()
        total_instructors = User.query.filter_by(role='instructor', status='active').count()
        pending_requests = User.query.filter_by(status='pending').count()
        total_users = User.query.count()

        total_classrooms = Classroom.query.count()
        total_assignments = Assignment.query.count()
        total_submissions = Submission.query.count()
        evaluated_submissions = Submission.query.filter(Submission.score.isnot(None), Submission.score != 'Pending').count()

        return jsonify({
            "users": {
                "total": total_users,
                "students": total_students,
                "instructors": total_instructors,
                "pending": pending_requests
            },
            "classrooms": {
                "total": total_classrooms
            },
            "assignments": {
                "total": total_assignments
            },
            "submissions": {
                "total": total_submissions,
                "evaluated": evaluated_submissions,
                "pending": total_submissions - evaluated_submissions
            }
        }), 200
    except Exception as e:
        print(f"Error fetching admin stats: {e}")
        return jsonify({"error": "Failed to calculate system stats."}), 500


# ==========================================
# 2. CLASSROOM MANAGEMENT
# ==========================================
@admin_bp.route('/classrooms', methods=['GET'])
@jwt_required()
def get_all_classrooms():
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    try:
        classrooms = Classroom.query.options(joinedload(Classroom.instructor)).all()

        enrollment_counts = dict(
            db.session.query(Enrollment.classroom_id, func.count(Enrollment.id))
            .group_by(Enrollment.classroom_id).all()
        )
        assignment_counts = dict(
            db.session.query(Assignment.classroom_id, func.count(Assignment.id))
            .group_by(Assignment.classroom_id).all()
        )

        class_list = []
        for c in classrooms:
            class_list.append({
                "id": c.id,
                "name": c.name,
                "invite_code": c.invite_code,
                "instructor_id": c.instructor_id,
                "instructor_name": c.instructor.username if c.instructor else "Unassigned",
                "instructor_email": c.instructor.email if c.instructor else "N/A",
                "student_count": enrollment_counts.get(c.id, 0),
                "assignment_count": assignment_counts.get(c.id, 0),
                "created_at": c.created_at.isoformat() if hasattr(c, 'created_at') and c.created_at else None
            })

        return jsonify(class_list), 200
    except Exception as e:
        print(f"Error fetching all classrooms: {e}")
        return jsonify({"error": "Failed to fetch classrooms list."}), 500


@admin_bp.route('/classrooms/<int:class_id>', methods=['PUT'])
@jwt_required()
def update_classroom(class_id):
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    classroom = Classroom.query.get(class_id)
    if not classroom:
        return jsonify({"error": "Classroom not found."}), 404

    data = request.get_json() or {}
    name = data.get('name', '').strip()
    instructor_id = data.get('instructor_id')

    if name:
        classroom.name = name

    if instructor_id:
        new_ins = User.query.filter_by(id=instructor_id, role='instructor').first()
        if not new_ins:
            return jsonify({"error": "Specified instructor does not exist."}), 400
        classroom.instructor_id = new_ins.id

    try:
        db.session.commit()
        return jsonify({
            "message": "Classroom updated successfully.",
            "classroom": {
                "id": classroom.id,
                "name": classroom.name,
                "invite_code": classroom.invite_code,
                "instructor_id": classroom.instructor_id
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error while updating classroom."}), 500


@admin_bp.route('/classrooms/<int:class_id>', methods=['DELETE'])
@jwt_required()
def delete_classroom(class_id):
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    classroom = Classroom.query.get(class_id)
    if not classroom:
        return jsonify({"error": "Classroom not found."}), 404

    try:
        Enrollment.query.filter_by(classroom_id=class_id).delete()

        assignments = Assignment.query.filter_by(classroom_id=class_id).all()
        for assign in assignments:
            Submission.query.filter_by(assignment_id=assign.id).delete()
            AssignmentAttachment.query.filter_by(assignment_id=assign.id).delete()
            db.session.delete(assign)

        db.session.delete(classroom)
        db.session.commit()
        return jsonify({"message": f"Classroom '{classroom.name}' and all associated tasks deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting classroom: {e}")
        return jsonify({"error": "Database error while deleting classroom."}), 500


# ==========================================
# 3. ASSIGNMENT MANAGEMENT
# ==========================================
@admin_bp.route('/assignments', methods=['GET'])
@jwt_required()
def get_all_assignments():
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    try:
        assignments = Assignment.query.options(
            joinedload(Assignment.classroom).joinedload(Classroom.instructor)
        ).order_by(Assignment.created_at.desc() if hasattr(Assignment, 'created_at') else Assignment.id.desc()).all()

        submission_counts = dict(
            db.session.query(Submission.assignment_id, func.count(Submission.id))
            .group_by(Submission.assignment_id).all()
        )

        assign_list = []
        for a in assignments:
            assign_list.append({
                "id": a.id,
                "title": a.title,
                "description": a.description,
                "language": a.language,
                "max_score": a.max_score,
                "deadline": a.deadline.isoformat() if a.deadline else None,
                "classroom_id": a.classroom_id,
                "classroom_name": a.classroom.name if a.classroom else "Unknown Classroom",
                "classroom_invite_code": a.classroom.invite_code if a.classroom else "N/A",
                "instructor_name": a.classroom.instructor.username if (a.classroom and a.classroom.instructor) else "Unknown",
                "submission_count": submission_counts.get(a.id, 0),
                "created_at": a.created_at.isoformat() if hasattr(a, 'created_at') and a.created_at else None
            })

        return jsonify(assign_list), 200
    except Exception as e:
        print(f"Error fetching all assignments: {e}")
        return jsonify({"error": "Failed to fetch assignments list."}), 500


@admin_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
@jwt_required()
def update_assignment(assignment_id):
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return jsonify({"error": "Assignment not found."}), 404

    data = request.get_json() or {}
    
    if 'title' in data and data['title'].strip():
        assignment.title = data['title'].strip()
    if 'description' in data:
        assignment.description = data['description']
    if 'language' in data:
        assignment.language = data['language'].lower()
    if 'max_score' in data:
        try:
            assignment.max_score = int(data['max_score'])
        except (ValueError, TypeError):
            pass
    if 'deadline' in data:
        deadline_val = data['deadline']
        if deadline_val:
            try:
                assignment.deadline = datetime.fromisoformat(deadline_val.replace('Z', '+00:00'))
            except Exception:
                try:
                    assignment.deadline = datetime.strptime(deadline_val, '%Y-%m-%d %H:%M:%S')
                except Exception:
                    pass
        else:
            assignment.deadline = None

    try:
        db.session.commit()
        return jsonify({
            "message": "Assignment updated successfully.",
            "assignment": assignment.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error while updating assignment."}), 500


@admin_bp.route('/assignments/<int:assignment_id>', methods=['DELETE'])
@jwt_required()
def delete_assignment(assignment_id):
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return jsonify({"error": "Assignment not found."}), 404

    try:
        Submission.query.filter_by(assignment_id=assignment_id).delete()
        AssignmentAttachment.query.filter_by(assignment_id=assignment_id).delete()
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({"message": f"Assignment '{assignment.title}' deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting assignment: {e}")
        return jsonify({"error": "Database error while deleting assignment."}), 500
