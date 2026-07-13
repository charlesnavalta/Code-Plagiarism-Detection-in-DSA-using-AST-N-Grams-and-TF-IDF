import os
import ast
import javalang
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime # 🌟 IMPORT THIS

# Create a dedicated Blueprint for submissions
submissions_bp = Blueprint('submissions', __name__)

@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assignment(class_id, assignment_id):
    """Handles multi-language file uploads with dynamic AST validation and Deadline enforcement"""
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

    # 🌟 NEW: THE DEADLINE LOCK
    # Strict server-side check. If the deadline exists and has passed, reject the file upload entirely.
    if assignment.deadline and datetime.utcnow() > assignment.deadline:
        return jsonify({"error": "Submission rejected: The deadline for this assignment has passed."}), 403

    # 1. THE HARD LOCK: Check if they already submitted!
    existing_submission = Submission.query.filter_by(student_id=user.id, assignment_id=assignment.id).first()
    if existing_submission:
        return jsonify({"error": "You have already submitted this assignment. Multiple uploads are not allowed."}), 400

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
    file.save(filepath)
    
    try:
        new_submission = Submission(
            assignment_id=assignment.id,
            student_id=user.id,
            filename=original_filename,
            file_path=filepath
        )
        db.session.add(new_submission)
        db.session.commit()
        
        # 🌟 Respond with the exact timestamp
        return jsonify({
            "message": f"{target_language.capitalize()} file submitted successfully!",
            "submitted_at": new_submission.submitted_at.isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error saving submission: {e}")
        return jsonify({"error": "Database error occurred while saving submission."}), 500
    

@submissions_bp.route('/<int:class_id>/assignments/<int:assignment_id>/submissions', methods=['GET'])
@jwt_required()
def get_assignment_submissions(class_id, assignment_id):
    """Allows an instructor to see all student submissions, including file content"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    submissions_data = []
    
    for s in submissions:
        content = "File content unavailable on server disk."
        if s.file_path and os.path.exists(s.file_path):
            try:
                with open(s.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            except Exception as e:
                print(f"Error reading file for {s.student.username}: {e}")

        # Adding raw_code to match frontend requirement for the CodeComparisonView
        submissions_data.append({
            "id": s.id,
            "student_name": s.student.username,
            "filename": s.filename,
            "content": content, 
            "raw_code": content, # Redundant but safe for specific frontend hooks
            "score": s.score or "Pending",
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

    # Verify classroom ownership
    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    data = request.get_json()
    score = data.get('score')

    if not score:
        return jsonify({"error": "Score is required."}), 400

    # Find the specific submission
    submission = Submission.query.filter_by(id=submission_id, assignment_id=assignment_id).first()
    if not submission:
        return jsonify({"error": "Submission not found."}), 404

    # Save the score
    try:
        submission.score = score
        db.session.commit()
        return jsonify({"message": "Grade saved successfully!", "score": score}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while saving grade."}), 500

# 🌟 NEW ENDPOINT: Fetch Student History
@submissions_bp.route('/student/history', methods=['GET'])
@jwt_required()
def get_student_history():
    """Fetches the recent submission history for the logged-in student"""
    try:
        current_user_id = get_jwt_identity()

        # Join Submission with Assignment to get the title, order by newest first
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