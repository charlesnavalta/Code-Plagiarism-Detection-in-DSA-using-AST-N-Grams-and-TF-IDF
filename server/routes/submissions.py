import os
import ast
import javalang
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.orm import joinedload
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission, to_iso_utc
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
    try:
        user_id = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id = current_user_id

    user = User.query.get(user_id) if user_id else None
    if not user or (user.role or '').lower() != 'student':
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
    submissions_dir = current_app.config.get('SUBMISSIONS_FOLDER', os.path.join(current_app.config['UPLOAD_FOLDER'], 'submissions'))
    os.makedirs(submissions_dir, exist_ok=True)
    filepath = os.path.join(submissions_dir, unique_filename)
    
    try:
        if is_resubmit:
            # Clean up the old physical file only if it is at a different location
            old_raw_path = getattr(existing_submission, 'file_path', None)
            if old_raw_path:
                resolved_old = resolve_submission_path(old_raw_path) or old_raw_path
                if os.path.exists(resolved_old) and os.path.abspath(resolved_old) != os.path.abspath(filepath):
                    try:
                        os.remove(resolved_old)
                    except Exception as file_err:
                        print(f"Warning: Failed to delete old file {resolved_old}: {file_err}")

            # Save the newly uploaded file to disk
            file.save(filepath)

            # Overwrite the existing database record
            existing_submission.filename = original_filename
            existing_submission.file_path = filepath
            existing_submission.submitted_at = datetime.utcnow()
            existing_submission.score = None  # Reset the grade
            existing_submission.allow_resubmit = False  # Relock the submission
            existing_submission.resubmission_count = getattr(existing_submission, 'resubmission_count', 0) + 1
            
            db.session.commit()
            sub_record = existing_submission
        else:
            # Save newly uploaded file to disk
            file.save(filepath)

            # Create brand-new submission record
            new_submission = Submission(
                assignment_id=assignment.id,
                student_id=user.id,
                filename=original_filename,
                file_path=filepath
            )
            db.session.add(new_submission)
            db.session.commit()
            sub_record = new_submission

        # 🌟 Event Trigger: Notify Instructor of new submission / resubmission
        try:
            from utils.notification_helper import create_notification
            classroom = Classroom.query.get(class_id)
            if classroom and classroom.instructor_id:
                action_label = "resubmitted" if is_resubmit else "submitted"
                create_notification(
                    user_id=classroom.instructor_id,
                    title=f"Submission Received: {assignment.title}",
                    message=f"{user.username} {action_label} their solution for '{assignment.title}' in {classroom.name}",
                    type="submission",
                    link=f"/instructor/class/{classroom.id}"
                )
        except Exception as notif_err:
            print(f"Notification Trigger Warning (Submission): {notif_err}")

        submitted_timestamp = to_iso_utc(sub_record.submitted_at)
        return jsonify({
            "message": f"{target_language.capitalize()} file {'resubmitted' if is_resubmit else 'submitted'} successfully!",
            "submitted_at": submitted_timestamp,
            "resubmission_count": getattr(sub_record, 'resubmission_count', 0)
        }), 200
            
    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE ERROR saving submission: {e}")
        return jsonify({"error": "Database error occurred while saving submission."}), 500


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions', methods=['GET'])
@jwt_required()
def get_assignment_submissions(class_id, assignment_id):
    """Allows an instructor to see all student submissions, including file content and resubmission status"""
    current_user_id = get_jwt_identity()
    try:
        user_id = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id = current_user_id

    user = User.query.get(user_id) if user_id else None
    if not user or (user.role or '').lower() != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    # Eager load student to prevent N+1 queries when accessing s.student.username
    submissions = Submission.query.options(
        joinedload(Submission.student)
    ).filter_by(assignment_id=assignment_id).all()
    
    submissions_data = []
    for s in submissions:
        content = "File content unavailable on server disk."
        actual_path = resolve_submission_path(s.file_path) if s.file_path else None
        if actual_path and os.path.exists(actual_path):
            try:
                with open(actual_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception as e:
                print(f"Error reading file for {s.student.username if s.student else s.student_id}: {e}")

        student_name = s.student.username if s.student else f"Student #{s.student_id}"
        student_avatar = getattr(s.student, 'avatar_url', None) if s.student else None
        submissions_data.append({
            "id": s.id,
            "student_name": student_name,
            "student_avatar": student_avatar,
            "filename": s.filename,
            "content": content, 
            "raw_code": content,
            "score": s.score or "Pending",
            "feedback": getattr(s, 'feedback', None) or "",
            "allow_resubmit": getattr(s, 'allow_resubmit', False),
            "resubmission_count": getattr(s, 'resubmission_count', 0),
            "submitted_at": to_iso_utc(s.submitted_at)
        })
    
    return jsonify(submissions_data), 200


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions/<int:submission_id>/grade', methods=['POST'])
@jwt_required()
def grade_submission(class_id, assignment_id, submission_id):
    """Allows an instructor to save a manual grade (and optional feedback) for a student's submission"""
    current_user_id = get_jwt_identity()
    try:
        user_id = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id = current_user_id

    user = User.query.get(user_id) if user_id else None
    if not user or (user.role or '').lower() != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    data = request.get_json() or {}
    score = data.get('score')
    feedback = data.get('feedback')

    if not score and feedback is None:
        return jsonify({"error": "Score or feedback is required."}), 400

    submission = Submission.query.options(
        joinedload(Submission.student)
    ).filter_by(id=submission_id, assignment_id=assignment_id).first()
    if not submission:
        return jsonify({"error": "Submission not found."}), 404

    try:
        if score:
            submission.score = score
        if feedback is not None:
            submission.feedback = feedback.strip() if isinstance(feedback, str) else ''
        db.session.commit()

        # 🌟 Event Trigger: Notify Student that grade was posted/updated
        try:
            from utils.notification_helper import create_notification
            create_notification(
                user_id=submission.student_id,
                title=f"Grade Posted: {assignment.title}",
                message=f"Your instructor posted a score of {submission.score} for '{assignment.title}' in {classroom.name}.",
                type="grade",
                link=f"/student/class/{classroom.id}/assignment/{assignment.id}"
            )
        except Exception as notif_err:
            print(f"Notification Trigger Warning (Grade): {notif_err}")

        return jsonify({
            "message": "Grade saved successfully!",
            "score": submission.score,
            "feedback": submission.feedback
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while saving grade."}), 500


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions/<int:submission_id>/feedback', methods=['POST'])
@jwt_required()
def comment_submission(class_id, assignment_id, submission_id):
    """Allows an instructor to leave or update comments/feedback for a student's submission"""
    current_user_id = get_jwt_identity()
    try:
        user_id = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id = current_user_id

    user = User.query.get(user_id) if user_id else None
    if not user or (user.role or '').lower() != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    data = request.get_json() or {}
    feedback = data.get('feedback', '')

    submission = Submission.query.options(
        joinedload(Submission.student)
    ).filter_by(id=submission_id, assignment_id=assignment_id).first()
    if not submission:
        return jsonify({"error": "Submission not found."}), 404

    try:
        clean_feedback = feedback.strip() if isinstance(feedback, str) else ''
        submission.feedback = clean_feedback
        db.session.commit()

        # 🌟 Event Trigger: Notify Student that instructor remarks were posted/updated
        try:
            from utils.notification_helper import create_notification
            feedback_preview = f": \"{clean_feedback[:60]}...\"" if len(clean_feedback) > 60 else (f": \"{clean_feedback}\"" if clean_feedback else "")
            create_notification(
                user_id=submission.student_id,
                title=f"Instructor Remarks: {assignment.title}",
                message=f"Your instructor left remarks on your submission for '{assignment.title}' in {classroom.name}{feedback_preview}.",
                type="remarks",
                link=f"/student/class/{classroom.id}/assignment/{assignment.id}"
            )
        except Exception as notif_err:
            print(f"Notification Trigger Warning (Remarks): {notif_err}")

        return jsonify({
            "message": "Feedback updated successfully!",
            "feedback": submission.feedback
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while saving feedback."}), 500


@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions/<int:submission_id>/allow-resubmit', methods=['PATCH'])
@jwt_required()
def allow_resubmission(class_id, assignment_id, submission_id):
    """Allows an instructor to unlock a specific student's submission for re-uploading"""
    current_user_id = get_jwt_identity()
    try:
        user_id = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id = current_user_id

    user = User.query.get(user_id) if user_id else None
    if not user or (user.role or '').lower() != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    submission = Submission.query.options(
        joinedload(Submission.student)
    ).filter_by(id=submission_id, assignment_id=assignment_id).first()
    if not submission:
        return jsonify({"error": "Submission not found."}), 404

    try:
        submission.allow_resubmit = True
        db.session.commit()
        student_name = submission.student.username if submission.student else f"Student #{submission.student_id}"

        # 🌟 Event Trigger: Notify Student that resubmission was unlocked
        try:
            from utils.notification_helper import create_notification
            create_notification(
                user_id=submission.student_id,
                title="Resubmission Unlocked",
                message=f"Your instructor unlocked resubmission for '{assignment.title}' in {classroom.name}. You may now upload your revised source code.",
                type="resubmit",
                link=f"/student/class/{classroom.id}/assignment/{assignment.id}"
            )
        except Exception as notif_err:
            print(f"Notification Trigger Warning (Resubmit): {notif_err}")

        return jsonify({"message": f"Resubmission unlocked for {student_name}!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update resubmission status."}), 500


@submissions_bp.route('/student/history', methods=['GET'])
@jwt_required()
def get_student_history():
    """Fetches the recent submission history for the logged-in student"""
    try:
        current_user_id = get_jwt_identity()
        try:
            user_id = int(current_user_id) if current_user_id is not None else None
        except (ValueError, TypeError):
            user_id = current_user_id

        user = User.query.get(user_id) if user_id else None
        if not user or (user.role or '').lower() != 'student':
            return jsonify({"error": "Unauthorized"}), 403

        history_query = db.session.query(Submission, Assignment).join(
            Assignment, Submission.assignment_id == Assignment.id
        ).filter(
            Submission.student_id == user.id
        ).order_by(Submission.submitted_at.desc()).limit(10).all()

        history_data = []
        for submission, assignment in history_query:
            history_data.append({
                "id": submission.id,
                "assignment_id": assignment.id,
                "classroom_id": assignment.classroom_id,
                "assignment_name": assignment.title,
                "submitted_at": to_iso_utc(submission.submitted_at),
                "score": submission.score or "Pending"
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
        try:
            user_id = int(current_user_id) if current_user_id is not None else None
        except (ValueError, TypeError):
            user_id = current_user_id

        user = User.query.get(user_id) if user_id else None
        if not user or (user.role or '').lower() != 'instructor':
            return jsonify({"error": "Unauthorized"}), 403

        recent = db.session.query(Submission, Assignment, Classroom, User).join(
            Assignment, Submission.assignment_id == Assignment.id
        ).join(
            Classroom, Assignment.classroom_id == Classroom.id
        ).join(
            User, Submission.student_id == User.id
        ).filter(
            Classroom.instructor_id == user.id
        ).order_by(Submission.submitted_at.desc()).limit(5).all()

        activity = []
        for submission, assignment, classroom, student in recent:
            activity.append({
                "id": submission.id,
                "assignment_id": assignment.id,
                "classroom_id": classroom.id,
                "student_name": student.username,
                "assignment_name": assignment.title,
                "classroom_name": classroom.name,
                "submitted_at": to_iso_utc(submission.submitted_at),
                "score": submission.score or "Pending"
            })

        return jsonify(activity), 200
    except Exception as e:
        print(f"FALSICODE ERROR fetching instructor activity: {e}")
        return jsonify({"error": "Failed to fetch activity"}), 500