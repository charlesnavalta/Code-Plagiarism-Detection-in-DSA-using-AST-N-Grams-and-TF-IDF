import os
from flask import Blueprint, request, jsonify
from sqlalchemy import func, case
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
# 1. OPTIMIZED SYSTEM-WIDE STATS & ANALYTICS
# ==========================================
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    try:
        # Query 1: Single Aggregation for all User Metrics
        user_row = db.session.query(
            func.count(User.id).label('total'),
            func.sum(case((User.role == 'student', 1), else_=0)).label('students'),
            func.sum(case(((User.role == 'instructor') & (User.status == 'active'), 1), else_=0)).label('instructors'),
            func.sum(case((User.status == 'pending', 1), else_=0)).label('pending')
        ).first()

        # Query 2: Submissions Aggregations + Fast Scalar Counts
        sub_row = db.session.query(
            func.count(Submission.id).label('total'),
            func.sum(case(((Submission.score.isnot(None)) & (Submission.score != 'Pending'), 1), else_=0)).label('evaluated')
        ).first()

        total_classrooms = db.session.query(func.count(Classroom.id)).scalar() or 0
        total_assignments = db.session.query(func.count(Assignment.id)).scalar() or 0

        total_users = int(user_row.total or 0)
        total_students = int(user_row.students or 0)
        total_instructors = int(user_row.instructors or 0)
        pending_requests = int(user_row.pending or 0)

        total_submissions = int(sub_row.total or 0)
        evaluated_submissions = int(sub_row.evaluated or 0)

        # Language distribution across assignments
        lang_counts_raw = db.session.query(
            Assignment.language, func.count(Assignment.id)
        ).group_by(Assignment.language).all()
        languages = {l[0].lower(): l[1] for l in lang_counts_raw if l[0]}

        # Plagiarism Risk Distribution across evaluated submissions
        eval_scores = db.session.query(Submission.score).filter(
            Submission.score.isnot(None),
            Submission.score != 'Pending'
        ).all()

        low_risk = 0
        mod_risk = 0
        high_risk = 0
        total_score_sum = 0
        valid_scores_count = 0

        for (sc,) in eval_scores:
            try:
                val = float(str(sc).replace('%', '').strip())
                total_score_sum += val
                valid_scores_count += 1
                if val < 30:
                    low_risk += 1
                elif val <= 65:
                    mod_risk += 1
                else:
                    high_risk += 1
            except Exception:
                low_risk += 1

        avg_similarity = round(total_score_sum / valid_scores_count, 1) if valid_scores_count > 0 else 0

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
            },
            "analytics": {
                "languages": languages,
                "risk": {
                    "low": low_risk,
                    "moderate": mod_risk,
                    "high": high_risk,
                    "total": evaluated_submissions,
                    "avg_similarity": avg_similarity
                }
            }
        }), 200
    except Exception as e:
        print(f"Error fetching admin stats: {e}")
        return jsonify({"error": "Failed to calculate system stats."}), 500


# ==========================================
# 2. OPTIMIZED CLASSROOM MANAGEMENT
# ==========================================
@admin_bp.route('/classrooms', methods=['GET'])
@jwt_required()
def get_all_classrooms():
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    try:
        classrooms_data = db.session.query(
            Classroom.id,
            Classroom.name,
            Classroom.invite_code,
            Classroom.instructor_id,
            Classroom.created_at,
            User.username.label('instructor_name'),
            User.email.label('instructor_email')
        ).outerjoin(User, Classroom.instructor_id == User.id).order_by(Classroom.id.desc()).all()

        enrollment_counts = dict(
            db.session.query(Enrollment.classroom_id, func.count(Enrollment.id))
            .group_by(Enrollment.classroom_id).all()
        )
        assignment_counts = dict(
            db.session.query(Assignment.classroom_id, func.count(Assignment.id))
            .group_by(Assignment.classroom_id).all()
        )

        class_list = [{
            "id": c.id,
            "name": c.name,
            "invite_code": c.invite_code,
            "instructor_id": c.instructor_id,
            "instructor_name": c.instructor_name or "Unassigned",
            "instructor_email": c.instructor_email or "N/A",
            "student_count": enrollment_counts.get(c.id, 0),
            "assignment_count": assignment_counts.get(c.id, 0),
            "created_at": c.created_at.isoformat() if hasattr(c, 'created_at') and c.created_at else None
        } for c in classrooms_data]

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
        assign_ids = [a[0] for a in db.session.query(Assignment.id).filter_by(classroom_id=class_id).all()]
        if assign_ids:
            Submission.query.filter(Submission.assignment_id.in_(assign_ids)).delete(synchronize_session=False)
            AssignmentAttachment.query.filter(AssignmentAttachment.assignment_id.in_(assign_ids)).delete(synchronize_session=False)
            Assignment.query.filter(Assignment.id.in_(assign_ids)).delete(synchronize_session=False)

        Enrollment.query.filter_by(classroom_id=class_id).delete(synchronize_session=False)
        db.session.delete(classroom)
        db.session.commit()
        return jsonify({"message": f"Classroom '{classroom.name}' and all associated tasks deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting classroom: {e}")
        return jsonify({"error": "Database error while deleting classroom."}), 500


# ==========================================
# 3. OPTIMIZED ASSIGNMENT MANAGEMENT
# ==========================================
@admin_bp.route('/assignments', methods=['GET'])
@jwt_required()
def get_all_assignments():
    admin = verify_admin()
    if not admin:
        return jsonify({"error": "Unauthorized. Admin privileges required."}), 403

    try:
        assign_rows = db.session.query(
            Assignment.id,
            Assignment.title,
            Assignment.description,
            Assignment.language,
            Assignment.max_score,
            Assignment.deadline,
            Assignment.created_at,
            Assignment.classroom_id,
            Classroom.name.label('classroom_name'),
            Classroom.invite_code.label('classroom_invite_code'),
            User.username.label('instructor_name')
        ).outerjoin(
            Classroom, Assignment.classroom_id == Classroom.id
        ).outerjoin(
            User, Classroom.instructor_id == User.id
        ).order_by(Assignment.id.desc()).all()

        submission_counts = dict(
            db.session.query(Submission.assignment_id, func.count(Submission.id))
            .group_by(Submission.assignment_id).all()
        )

        assign_list = [{
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "language": a.language,
            "max_score": a.max_score,
            "deadline": a.deadline.isoformat() if a.deadline else None,
            "classroom_id": a.classroom_id,
            "classroom_name": a.classroom_name or "Unknown Classroom",
            "classroom_invite_code": a.classroom_invite_code or "N/A",
            "instructor_name": a.instructor_name or "Unknown",
            "submission_count": submission_counts.get(a.id, 0),
            "created_at": a.created_at.isoformat() if hasattr(a, 'created_at') and a.created_at else None
        } for a in assign_rows]

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
        Submission.query.filter_by(assignment_id=assignment_id).delete(synchronize_session=False)
        AssignmentAttachment.query.filter_by(assignment_id=assignment_id).delete(synchronize_session=False)
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({"message": f"Assignment '{assignment.title}' deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting assignment: {e}")
        return jsonify({"error": "Database error while deleting assignment."}), 500


# ==========================================
# 5. SYSTEM / DATABASE MAINTENANCE
# ==========================================
@admin_bp.route('/system/reseed', methods=['POST'], strict_slashes=False)
def trigger_database_reseed():
    """Wipes and reseeds the entire database with the latest codebase datasets and users.
    Can be authorized via:
      1. Active Admin JWT Token (Authorization: Bearer <token>)
      2. Secret Header (X-Reseed-Key: <SECRET_KEY> or 'falsicode-reseed-2026')
      3. Request JSON payload with { "secret": "falsicode-reseed-2026" }
      4. Database has 0 users (initial bootstrap)
    """
    is_authorized = False
    actor = "System API"

    # Check 0: Database is completely empty (bootstrap mode)
    try:
        if User.query.count() == 0:
            is_authorized = True
            actor = "Initial Bootstrap"
    except Exception:
        pass

    # Check 1: Secret Key Header or Body
    body_data = request.get_json(silent=True) or {}
    body_secret = body_data.get('secret')
    reseed_key = request.headers.get('X-Reseed-Key') or request.headers.get('x-reseed-key') or body_secret
    secret_key = os.environ.get('SECRET_KEY')

    if reseed_key and (reseed_key == secret_key or reseed_key == 'falsicode-reseed-2026'):
        is_authorized = True
        actor = "Master Reseed Key"

    # Check 2: Admin JWT
    if not is_authorized:
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            admin = verify_admin()
            if admin:
                is_authorized = True
                actor = admin.username
        except Exception:
            pass

    if not is_authorized:
        return jsonify({"error": "Unauthorized. Admin privileges or valid secret required."}), 403

    try:
        from seeder import run_smart_seed
        print(f"FALSICODE: Reseed requested by [{actor}]. Executing Smart Seed...")
        run_smart_seed(db)
        return jsonify({
            "message": "Database successfully wiped and reseeded with the latest datasets, classrooms, and students!",
            "reseeded_by": actor,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE ERROR during database reseed: {e}")
        return jsonify({"error": f"Failed to reseed database: {str(e)}"}), 500


