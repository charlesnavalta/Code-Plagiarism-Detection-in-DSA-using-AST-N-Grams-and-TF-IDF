import os
import ast
import javalang
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.orm import joinedload
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from routes.analysis import resolve_submission_path

# Create a dedicated Blueprint for submissions
submissions_bp = Blueprint('submissions', __name__)

@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assignment(class_id, assignment_id):
    """Handles multi-language file uploads with dynamic AST validation, Deadline enforcement, and Resubmission logic"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user.role != 'student':
        return jsonify({"error": "Only students can submit assignments."}), 403

    enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
    if not enrollment:
        return jsonify({"error": "You are not enrolled in this class."}), 403

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found."}), 404

    # 1. Check for an existing submission and its resubmit status
    existing_submission = Submission.query.filter_by(student_id=user.id, assignment_id=assignment.id).first()
    is_resubmit = existing_submission and getattr(existing_submission, 'allow_resubmit', False)

    # If resubmission is active, verify that its dedicated deadline has not expired
    if is_resubmit:
        resub_deadline = getattr(existing_submission, 'resubmission_deadline', None)
        if resub_deadline and datetime.utcnow() > resub_deadline:
            return jsonify({"error": "Submission rejected: The instructor's resubmission deadline for your file has passed."}), 403

    # 2. THE HARD LOCK: Reject if submitted and resubmission is NOT allowed
    if existing_submission and not is_resubmit:
        return jsonify({"error": "You have already submitted this assignment. Multiple uploads are not allowed."}), 400

    # 3. THE DEADLINE LOCK: Bypass the deadline ONLY if the instructor explicitly allowed a resubmit
    if not is_resubmit and assignment.deadline and datetime.utcnow() > assignment.deadline:
        return jsonify({"error": "Submission rejected: The deadline for this assignment has passed."}), 403

    if 'file' not in request.files:
        return jsonify({"error": "No file part detected."}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
        
    target_language = assignment.language.lower() if assignment.language else 'python'
    expected_extension = '.java' if target_language == 'java' else '.py'

    if not file.filename.endswith(expected_extension):
        return jsonify({"error": f"Invalid format. This assignment requires {expected_extension} files."}), 400

    try:
        file_content = file.read().decode('utf-8')
        
        # Validate Syntax based on language
        if target_language == 'java':
            try:
                javalang.parse.parse(file_content)
            except javalang.parser.JavaSyntaxError:
                javalang.parse.parse(f"public class DummyClass {{ {file_content} }}")
        else:
            ast.parse(file_content)
            
        file.seek(0) 
    except SyntaxError as e:
        return jsonify({"error": f"Upload rejected! Syntax error on line {getattr(e, 'lineno', 'unknown')}: {getattr(e, 'msg', str(e))}"}), 400
    except javalang.parser.JavaSyntaxError as e:
        return jsonify({"error": f"Upload rejected! Java syntax error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Upload rejected! Invalid code file: {str(e)}"}), 400

    original_filename = secure_filename(file.filename)
    unique_filename = f"student_{user.id}_assign_{assignment.id}_{original_filename}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    
    try:
        file.save(filepath)
        
        if is_resubmit:
            # Clean up the old physical file on server disk
            if os.path.exists(existing_submission.file_path):
                try:
                    os.remove(existing_submission.file_path)
                except Exception as file_err:
                    print(f"Warning: Failed to delete old file {existing_submission.file_path}: {file_err}")
                
            # Overwrite the existing database record
            existing_submission.filename = original_filename
            existing_submission.file_path = filepath
            existing_submission.submitted_at = datetime.utcnow()
            existing_submission.score = None  # Reset the grade
            existing_submission.allow_resubmit = False  # Relock the submission
            existing_submission.resubmission_deadline = None  # Reset resubmit deadline
            
            db.session.commit()
            return jsonify({
                "message": f"{target_language.capitalize()} file resubmitted successfully!",
                "submitted_at": existing_submission.submitted_at.isoformat()
            }), 200
        else:
            # First time submission
            new_submission = Submission(
                assignment_id=assignment.id,
                student_id=user.id,
                filename=original_filename,
                file_path=filepath
            )
            db.session.add(new_submission)
            db.session.commit()
            
            return jsonify({
                "message": f"{target_language.capitalize()} file submitted successfully!", 
                "submission_id": new_submission.id,
                "submitted_at": new_submission.submitted_at.isoformat()
            }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to persist file: {str(e)}"}), 500


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions', methods=['GET'])
@jwt_required()
def get_assignment_submissions(class_id, assignment_id):
    """Fetches all student submissions for a specific assignment (Instructor Only)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    # Eager load student to prevent N+1 queries when accessing s.student.username
    submissions = Submission.query.options(
        joinedload(Submission.student)
    ).filter_by(assignment_id=assignment_id).all()
    
    submissions_data = []
    for s in submissions:
        content = ""
        actual_path = resolve_submission_path(s.file_path) if s.file_path else None
        if actual_path and os.path.exists(actual_path):
            try:
                with open(actual_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception as e:
                print(f"Error reading file for {s.student.username if s.student else s.student_id}: {e}")

        student_name = s.student.username if s.student else f"Student #{s.student_id}"
        submissions_data.append({
            "id": s.id,
            "student_name": student_name,
            "filename": s.filename,
            "content": content, 
            "raw_code": content,
            "score": s.score or "Pending",
            "allow_resubmit": getattr(s, 'allow_resubmit', False),
            "resubmission_deadline": s.resubmission_deadline.isoformat() if getattr(s, 'resubmission_deadline', None) else None,
            "submitted_at": s.submitted_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify(submissions_data), 200


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions/<int:submission_id>/grade', methods=['POST'])
@jwt_required()
def grade_submission(class_id, assignment_id, submission_id):
    """Allows an instructor to save a manual grade for a student's submission"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    data = request.get_json()
    score = data.get('score')

    if not score:
        return jsonify({"error": "Score is required."}), 400

    submission = Submission.query.filter_by(id=submission_id, assignment_id=assignment_id).first()
    if not submission:
        return jsonify({"error": "Submission not found."}), 404

    try:
        submission.score = score
        db.session.commit()
        return jsonify({"message": "Grade saved successfully!", "score": score}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while saving grade."}), 500


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions/<int:submission_id>/allow-resubmit', methods=['PATCH'])
@jwt_required()
def allow_resubmission(class_id, assignment_id, submission_id):
    """Allows an instructor to unlock a specific student's submission for re-uploading with optional deadline"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    submission = Submission.query.options(
        joinedload(Submission.student)
    ).filter_by(id=submission_id, assignment_id=assignment_id).first()
    if not submission:
        return jsonify({"error": "Submission not found."}), 404

    data = request.get_json(silent=True) or {}
    
    # Check if instructor is revoking resubmission permission
    if data.get('action') == 'revoke' or data.get('allow_resubmit') is False:
        try:
            submission.allow_resubmit = False
            submission.resubmission_deadline = None
            db.session.commit()
            student_name = submission.student.username if submission.student else f"Student #{submission.student_id}"
            return jsonify({
                "message": f"Resubmission permission revoked for {student_name}.",
                "allow_resubmit": False,
                "resubmission_deadline": None
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to revoke resubmission status."}), 500

    # Parse optional resubmission deadline
    deadline_str = data.get('resubmission_deadline')
    deadline_dt = None
    if deadline_str:
        try:
            clean_str = deadline_str.replace('Z', '')
            deadline_dt = datetime.fromisoformat(clean_str)
        except Exception:
            try:
                deadline_dt = datetime.strptime(deadline_str, '%Y-%m-%d %H:%M:%S')
            except Exception:
                try:
                    deadline_dt = datetime.strptime(deadline_str, '%Y-%m-%dT%H:%M')
                except Exception as parse_err:
                    return jsonify({"error": f"Invalid deadline format: {parse_err}"}), 400

    try:
        submission.allow_resubmit = True
        submission.resubmission_deadline = deadline_dt
        db.session.commit()
        student_name = submission.student.username if submission.student else f"Student #{submission.student_id}"
        return jsonify({
            "message": f"Resubmission unlocked for {student_name}!",
            "allow_resubmit": True,
            "resubmission_deadline": submission.resubmission_deadline.isoformat() if submission.resubmission_deadline else None
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update resubmission status."}), 500


@submissions_bp.route('/student/history', methods=['GET'])
@jwt_required()
def get_student_history():
    """Fetches the recent submission history for the logged-in student"""
    try:
        current_user_id = get_jwt_identity()

        history_query = db.session.query(Submission, Assignment).join(
            Assignment, Submission.assignment_id == Assignment.id
        ).filter(
            Submission.student_id == current_user_id
        ).order_by(Submission.submitted_at.desc()).limit(10).all()

        history_data = []
        for submission, assignment in history_query:
            history_data.append({
                "id": submission.id,
                "assignment_name": assignment.title,
                "submitted_at": submission.submitted_at.isoformat() if submission.submitted_at else None,
                "score": submission.score
            })

        return jsonify(history_data), 200

    except Exception as e:
        print(f"FALSICODE ERROR fetching history: {e}")
        return jsonify({"error": "Failed to fetch submission history"}), 500


@submissions_bp.route('/instructor/activity', methods=['GET'])
@jwt_required()
def get_instructor_activity():
    """Fetches recent submissions across all classrooms owned by the instructor in a single JOIN."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'instructor':
            return jsonify({"error": "Unauthorized"}), 403

        recent = db.session.query(Submission, Assignment, Classroom, User).join(
            Assignment, Submission.assignment_id == Assignment.id
        ).join(
            Classroom, Assignment.classroom_id == Classroom.id
        ).join(
            User, Submission.student_id == User.id
        ).filter(
            Classroom.instructor_id == current_user_id
        ).order_by(Submission.submitted_at.desc()).limit(5).all()

        activity = []
        for submission, assignment, classroom, student in recent:
            activity.append({
                "id": submission.id,
                "student_name": student.username,
                "assignment_name": assignment.title,
                "classroom_name": classroom.name,
                "submitted_at": submission.submitted_at.isoformat() if submission.submitted_at else None,
                "score": submission.score
            })

        return jsonify(activity), 200
    except Exception as e:
        print(f"FALSICODE ERROR fetching instructor activity: {e}")
        return jsonify({"error": "Failed to fetch activity"}), 500