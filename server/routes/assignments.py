import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app, send_file
from sqlalchemy import func
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission, AssignmentAttachment
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

# Create a dedicated Blueprint for assignments
assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/<int:class_id>/assignments', methods=['POST'])
@jwt_required()
def create_assignment(class_id):
    """Allows an instructor to create an assignment with up to 3 file attachments"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    # 🌟 Shift from get_json() to form data to support file uploads
    data = request.form
    if not data or 'title' not in data:
        return jsonify({"error": "Assignment title is required."}), 400

    parsed_deadline = None
    if data.get('deadline'):
        try:
            parsed_deadline = datetime.fromisoformat(data.get('deadline').replace('Z', ''))
            if parsed_deadline < (datetime.utcnow() - timedelta(minutes=1)):
                return jsonify({"error": "Assignment deadline cannot be set in the past. Please choose a future date and time."}), 400
        except ValueError:
            return jsonify({"error": "Invalid deadline format provided."}), 400

    new_assignment = Assignment(
        title=data.get('title'),
        description=data.get('description', ''),
        max_score=int(data.get('max_score', 100)),
        classroom_id=classroom.id,
        language=data.get('language', 'python').lower(),
        deadline=parsed_deadline 
    )
    
    try:
        db.session.add(new_assignment)
        db.session.flush() # Flushes to get the new_assignment.id before committing

        # 🌟 Handle the Attachments (Max 3)
        files = request.files.getlist('files')
        if len(files) > 3:
            return jsonify({"error": "Maximum of 3 guide files allowed."}), 400

        for file in files:
            if file and file.filename != '':
                original_filename = secure_filename(file.filename)
                # Prefix with assignment ID to prevent naming collisions
                unique_filename = f"guide_assign_{new_assignment.id}_{original_filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
                
                file.save(filepath)
                
                new_attachment = AssignmentAttachment(
                    assignment_id=new_assignment.id,
                    filename=original_filename,
                    file_path=filepath
                )
                db.session.add(new_attachment)

        db.session.commit()
        return jsonify({
            "message": "Assignment created successfully!",
            "assignment": new_assignment.to_dict() 
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE ERROR creating assignment: {e}")
        return jsonify({"error": "Database error occurred"}), 500


@assignments_bp.route('/<int:class_id>/assignments', methods=['GET'])
@jwt_required()
def get_assignments(class_id):
    """Fetches all assignments and attaches the student's submission status and guide files in bulk"""
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
    if not assignments:
        return jsonify([]), 200

    assignment_ids = [a.id for a in assignments]

    # 1. Batch fetch submission counts across all assignments in 1 query
    sub_count_results = db.session.query(
        Submission.assignment_id,
        func.count(Submission.id)
    ).filter(
        Submission.assignment_id.in_(assignment_ids)
    ).group_by(Submission.assignment_id).all()
    sub_counts = {assign_id: count for assign_id, count in sub_count_results}

    # 2. Batch fetch attachments for all assignments in 1 query
    all_attachments = AssignmentAttachment.query.filter(
        AssignmentAttachment.assignment_id.in_(assignment_ids)
    ).all()
    attach_map = {}
    for att in all_attachments:
        attach_map.setdefault(att.assignment_id, []).append({
            "id": att.id,
            "filename": att.filename,
            "url": f"/classrooms/{class_id}/attachments/{att.id}"
        })

    # 3. Batch fetch student submissions in 1 query (if student)
    student_subs = {}
    if user.role == 'student':
        subs = Submission.query.filter(
            Submission.assignment_id.in_(assignment_ids),
            Submission.student_id == user.id
        ).all()
        student_subs = {s.assignment_id: s for s in subs}

    # 4. Construct response payload in memory
    assignments_data = []
    for a in assignments:
        assignment_info = {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "max_score": a.max_score,
            "language": a.language,
            "deadline": a.deadline.isoformat() if a.deadline else None,
            "submission_count": sub_counts.get(a.id, 0),
            "has_submitted": False,
            "score": None,
            "submitted_at": None,
            "allow_resubmit": False,
            "attachments": attach_map.get(a.id, [])
        }

        if user.role == 'student' and a.id in student_subs:
            sub = student_subs[a.id]
            assignment_info["has_submitted"] = True
            assignment_info["score"] = getattr(sub, 'score', 'Pending')
            assignment_info["submitted_at"] = sub.submitted_at.isoformat() if sub.submitted_at else None
            assignment_info["allow_resubmit"] = getattr(sub, 'allow_resubmit', False)

        assignments_data.append(assignment_info)
        
    return jsonify(assignments_data), 200


@assignments_bp.route('/<int:class_id>/assignments/<int:assignment_id>', methods=['GET'])
@jwt_required()
def get_assignment(class_id, assignment_id):
    """Fetches full details for a single assignment including attachments and student submission status"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if user.role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    elif user.role == 'student':
        enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
        classroom = enrollment.classroom if enrollment else None
    else:
        return jsonify({"error": "Unauthorized"}), 403

    if not classroom:
        return jsonify({"error": "Classroom not found or access denied"}), 404

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    # Attachments
    attachments = AssignmentAttachment.query.filter_by(assignment_id=assignment.id).all()
    attach_list = [{
        "id": att.id,
        "filename": att.filename,
        "url": f"/classrooms/{class_id}/attachments/{att.id}"
    } for att in attachments]

    assignment_info = {
        "id": assignment.id,
        "title": assignment.title,
        "description": assignment.description,
        "max_score": assignment.max_score,
        "language": assignment.language,
        "deadline": assignment.deadline.isoformat() if assignment.deadline else None,
        "classroom_name": classroom.name,
        "instructor_name": classroom.instructor.username if classroom.instructor else "Instructor",
        "has_submitted": False,
        "score": None,
        "submitted_at": None,
        "submitted_filename": None,
        "allow_resubmit": False,
        "attachments": attach_list
    }

    if user.role == 'student':
        sub = Submission.query.filter_by(assignment_id=assignment.id, student_id=user.id).first()
        if sub:
            assignment_info["has_submitted"] = True
            assignment_info["score"] = getattr(sub, 'score', 'Pending')
            assignment_info["submitted_at"] = sub.submitted_at.isoformat() if sub.submitted_at else None
            assignment_info["submitted_filename"] = getattr(sub, 'filename', None)
            assignment_info["allow_resubmit"] = getattr(sub, 'allow_resubmit', False)

    return jsonify(assignment_info), 200


@assignments_bp.route('/<int:class_id>/assignments/<int:assignment_id>', methods=['PUT'])
@jwt_required()
def update_assignment(class_id, assignment_id):
    """Allows an instructor to edit an existing assignment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    assignment = Assignment.query.get(assignment_id)
    if not assignment or assignment.classroom_id != class_id:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    classroom = Classroom.query.get(class_id)
    if not classroom or classroom.instructor_id != user.id:
        return jsonify({"error": "Unauthorized to edit this assignment"}), 403

    data = request.get_json()

    if 'title' in data:
        assignment.title = data['title']
    if 'description' in data:
        assignment.description = data['description']
    if 'max_score' in data:
        assignment.max_score = data['max_score']
    if 'language' in data:
        assignment.language = data['language'].lower()
    
    if 'deadline' in data:
        if data['deadline']:
            try:
                parsed_deadline = datetime.fromisoformat(data['deadline'].replace('Z', ''))
                if parsed_deadline < (datetime.utcnow() - timedelta(minutes=1)):
                    return jsonify({"error": "Assignment deadline cannot be set in the past. Please choose a future date and time."}), 400
                assignment.deadline = parsed_deadline
            except ValueError:
                return jsonify({"error": "Invalid deadline format provided."}), 400
        else:
            assignment.deadline = None 

    try:
        db.session.commit()
        response_data = assignment.to_dict()
        response_data['submission_count'] = Submission.query.filter_by(assignment_id=assignment.id).count()
        return jsonify({
            "message": "Assignment updated successfully",
            **response_data
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating assignment: {str(e)}")
        return jsonify({"error": "Database error occurred while updating"}), 500


@assignments_bp.route('/<int:class_id>/assignments/<int:assignment_id>', methods=['DELETE'])
@jwt_required()
def delete_assignment(class_id, assignment_id):
    """Allows an instructor to delete an existing assignment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    assignment = Assignment.query.get(assignment_id)
    if not assignment or assignment.classroom_id != class_id:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    classroom = Classroom.query.get(class_id)
    if not classroom or classroom.instructor_id != user.id:
        return jsonify({"error": "Unauthorized to delete this assignment"}), 403

    try:
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({
            "message": "Assignment deleted successfully",
            "id": assignment_id
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting assignment: {str(e)}")
        return jsonify({"error": "Database error occurred while deleting"}), 500

# ==========================================
# 🌟 UPDATED: View / Download Attachment Route
# ==========================================
@assignments_bp.route('/<int:class_id>/attachments/<int:attachment_id>', methods=['GET'])
@jwt_required()
def get_attachment(class_id, attachment_id):
    """Securely serves the guide file for inline viewing or downloading"""
    raw_identity = get_jwt_identity()
    user_id = int(raw_identity) if str(raw_identity).isdigit() else raw_identity
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User session invalid."}), 401

    if user.role == 'student':
        enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
        if not enrollment:
            return jsonify({"error": "Unauthorized access to classroom files."}), 403
    elif user.role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
        if not classroom:
            return jsonify({"error": "Unauthorized access to this classroom."}), 403

    attachment = AssignmentAttachment.query.get(attachment_id)
    if not attachment:
        return jsonify({"error": "Attachment record not found."}), 404

    # Robust file resolution: check absolute path, then upload directory candidates
    file_path = attachment.file_path
    if not os.path.exists(file_path):
        filename_only = os.path.basename(attachment.file_path)
        candidates = [
            os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'), filename_only),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', filename_only),
            os.path.join(os.getcwd(), 'server', 'uploads', filename_only),
            os.path.join(os.getcwd(), 'uploads', filename_only),
            # Also check by original attachment filename
            os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'), attachment.filename),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', attachment.filename),
            os.path.join(os.getcwd(), 'server', 'uploads', attachment.filename),
            os.path.join(os.getcwd(), 'uploads', attachment.filename),
        ]
        resolved = None
        for candidate in candidates:
            if os.path.exists(candidate):
                resolved = candidate
                break
        if resolved:
            file_path = resolved
        else:
            return jsonify({"error": "Physical attachment file is missing from server storage."}), 404

    # Determine MIME type for correct browser preview
    ext = os.path.splitext(attachment.filename)[1].lower()
    mime_map = {
        '.pdf': 'application/pdf',
        '.py': 'text/x-python',
        '.java': 'text/x-java-source',
        '.cpp': 'text/x-c',
        '.c': 'text/x-c',
        '.txt': 'text/plain',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.zip': 'application/zip'
    }
    mimetype = mime_map.get(ext, 'application/octet-stream')

    is_download = request.args.get('download', 'false').lower() == 'true'

    try:
        return send_file(
            file_path,
            mimetype=mimetype,
            as_attachment=is_download,
            download_name=attachment.filename
        )
    except Exception as e:
        print(f"Error serving attachment file: {e}")
        return jsonify({"error": f"Failed to serve file: {str(e)}"}), 500