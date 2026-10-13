import os
import mimetypes
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app, send_file
from sqlalchemy import func
from database import db
from models import User, Classroom, Assignment, Enrollment, Submission, AssignmentAttachment, to_iso_utc
from utils.file_manager import cleanup_assignment_files
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

# Create a dedicated Blueprint for assignments
assignments_bp = Blueprint('assignments', __name__)

# Allowed / Disallowed File Types & Size Limits for Guide & Reference Materials
MAX_GUIDE_FILE_SIZE = 10 * 1024 * 1024  # 10 MB per file

ALLOWED_GUIDE_EXTENSIONS = {
    # Documents
    '.pdf', '.doc', '.docx', '.txt', '.rtf', '.md', '.odt',
    # Spreadsheets & Presentations
    '.csv', '.tsv', '.xls', '.xlsx', '.ppt', '.pptx',
    # Code & Algorithms / DSA Tools
    '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.xml', '.sql',
    # Archives
    '.zip', '.tar', '.gz', '.7z', '.rar',
    # Images / Diagrams
    '.png', '.jpg', '.jpeg', '.webp', '.svg'
}

DISALLOWED_MEDIA_EXTENSIONS = {
    # Audio
    '.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma', '.mid', '.midi',
    # Video
    '.mp4', '.avi', '.mov', '.mkv', '.webm', '.wmv', '.flv', '.m4v', '.3gp', '.m4p', '.mpg', '.mpeg', '.vob'
}

def validate_guide_file(file):
    """
    Validates a single guide file uploaded for an assignment.
    Ensures it adheres to allowed extensions, is not an audio/video or dangerous binary,
    is not 0 bytes, and does not exceed the 10 MB limit.
    """
    if not file or not file.filename:
        return None

    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    content_type = (file.content_type or '').lower()

    # 1. Reject audio and video files explicitly
    if ext in DISALLOWED_MEDIA_EXTENSIONS or content_type.startswith('audio/') or content_type.startswith('video/'):
        return f"Audio and video files ({ext or content_type}) are not permitted as guide materials."

    # 2. Reject executable / dangerous system scripts
    dangerous_exts = {'.exe', '.msi', '.bat', '.cmd', '.sh', '.bin', '.dll', '.com', '.vbs', '.ps1'}
    if ext in dangerous_exts:
        return f"Executable and system script files ({ext}) cannot be uploaded as guide materials."

    # 3. Whitelist check
    if ext not in ALLOWED_GUIDE_EXTENSIONS:
        return f"File '{filename}' has an unsupported file type ({ext or 'no extension'}). Allowed formats: PDF, DOCX, TXT, Code, ZIP, images."

    # 4. Check file size
    try:
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
    except Exception:
        size = 0

    if size == 0:
        return f"File '{filename}' is empty (0 bytes). Please upload a valid document or reference material."

    if size > MAX_GUIDE_FILE_SIZE:
        size_mb = round(size / (1024 * 1024), 2)
        return f"File '{filename}' exceeds the maximum allowed size of 10 MB ({size_mb} MB)."

    return None

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
    if not data or 'title' not in data or not data.get('title', '').strip():
        return jsonify({"error": "Assignment title is required."}), 400

    if not data.get('deadline'):
        return jsonify({"error": "Assignment deadline is required. Please set a deadline."}), 400

    parsed_deadline = None
    try:
        parsed_deadline = datetime.fromisoformat(data.get('deadline').replace('Z', ''))
        if parsed_deadline < (datetime.utcnow() - timedelta(minutes=1)):
            return jsonify({"error": "Assignment deadline cannot be set in the past. Please choose a future date and time."}), 400
    except (ValueError, TypeError):
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
        files = [f for f in request.files.getlist('files') if f and f.filename != ''] if request.files else []
        if len(files) > 3:
            return jsonify({"error": "Maximum of 3 guide files allowed."}), 400

        # Validate all files before writing to disk
        for file in files:
            val_error = validate_guide_file(file)
            if val_error:
                return jsonify({"error": val_error}), 400

        for file in files:
            original_filename = secure_filename(file.filename)
            if not original_filename:
                original_filename = f"guide_{int(datetime.utcnow().timestamp())}{os.path.splitext(file.filename)[1]}"
            unique_filename = f"guide_assign_{new_assignment.id}_{original_filename}"
            # Prefix with assignment ID to prevent naming collisions
            attachments_dir = current_app.config.get('ATTACHMENTS_FOLDER', os.path.join(current_app.config['UPLOAD_FOLDER'], 'attachments'))
            os.makedirs(attachments_dir, exist_ok=True)
            filepath = os.path.join(attachments_dir, unique_filename)
            
            file.save(filepath)
            
            new_attachment = AssignmentAttachment(
                assignment_id=new_assignment.id,
                filename=original_filename,
                file_path=filepath
            )
            db.session.add(new_attachment)

        db.session.commit()

        # 🌟 Event Trigger: Notify all enrolled students about the new assignment
        try:
            from utils.notification_helper import create_bulk_notifications
            enrollments = Enrollment.query.filter_by(classroom_id=classroom.id).all()
            student_ids = [e.student_id for e in enrollments]
            if student_ids:
                create_bulk_notifications(
                    user_ids=student_ids,
                    title="New Assignment Posted",
                    message=f"{user.username} posted a new assignment: '{new_assignment.title}' in {classroom.name}",
                    type="assignment",
                    link=f"/student/class/{classroom.id}/assignment/{new_assignment.id}"
                )
        except Exception as notif_err:
            print(f"Notification Trigger Warning (Assignment): {notif_err}")

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
    try:
        user_id = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id = current_user_id

    user = User.query.get(user_id) if user_id else None
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    role = (user.role or '').lower()

    if role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    elif role == 'student':
        enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
        classroom = enrollment.classroom if enrollment else None
    elif role == 'admin':
        classroom = Classroom.query.get(class_id)
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
    if role == 'student':
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
            "deadline": to_iso_utc(a.deadline),
            "submission_count": sub_counts.get(a.id, 0),
            "has_submitted": False,
            "score": None,
            "feedback": None,
            "submitted_at": None,
            "allow_resubmit": False,
            "resubmission_count": 0,
            "attachments": attach_map.get(a.id, [])
        }

        if role == 'student' and a.id in student_subs:
            sub = student_subs[a.id]
            assignment_info["has_submitted"] = True
            assignment_info["score"] = getattr(sub, 'score', 'Pending')
            assignment_info["feedback"] = getattr(sub, 'feedback', None)
            assignment_info["submitted_at"] = to_iso_utc(sub.submitted_at)
            assignment_info["submitted_filename"] = getattr(sub, 'filename', None)
            assignment_info["allow_resubmit"] = getattr(sub, 'allow_resubmit', False)
            assignment_info["resubmission_count"] = getattr(sub, 'resubmission_count', 0)

        assignments_data.append(assignment_info)
        
    return jsonify(assignments_data), 200


@assignments_bp.route('/<int:class_id>/assignments/<int:assignment_id>', methods=['GET'])
@jwt_required()
def get_assignment(class_id, assignment_id):
    """Fetches full details for a single assignment including attachments and student submission status"""
    current_user_id = get_jwt_identity()
    try:
        user_id_int = int(current_user_id) if current_user_id is not None else None
    except (ValueError, TypeError):
        user_id_int = current_user_id

    user = User.query.get(user_id_int) if user_id_int else None
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    role = (user.role or '').lower()

    if role == 'instructor':
        classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    elif role == 'student':
        enrollment = Enrollment.query.filter_by(student_id=user.id, classroom_id=class_id).first()
        classroom = enrollment.classroom if enrollment else None
    elif role == 'admin':
        classroom = Classroom.query.get(class_id)
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
        "deadline": to_iso_utc(assignment.deadline),
        "classroom_name": classroom.name,
        "instructor_name": classroom.instructor.username if classroom.instructor else "Instructor",
        "has_submitted": False,
        "score": None,
        "feedback": None,
        "submitted_at": None,
        "submitted_filename": None,
        "allow_resubmit": False,
        "resubmission_count": 0,
        "attachments": attach_list
    }

    if role == 'student':
        sub = Submission.query.filter_by(assignment_id=assignment.id, student_id=user.id).first()
        if sub:
            assignment_info["has_submitted"] = True
            assignment_info["score"] = getattr(sub, 'score', 'Pending')
            assignment_info["feedback"] = getattr(sub, 'feedback', None)
            assignment_info["submitted_at"] = to_iso_utc(sub.submitted_at)
            assignment_info["submitted_filename"] = getattr(sub, 'filename', None)
            assignment_info["allow_resubmit"] = getattr(sub, 'allow_resubmit', False)
            assignment_info["resubmission_count"] = getattr(sub, 'resubmission_count', 0)

    return jsonify(assignment_info), 200


@assignments_bp.route('/<int:class_id>/assignments/<int:assignment_id>', methods=['PUT'])
@jwt_required()
def update_assignment(class_id, assignment_id):
    """Allows an instructor to edit an existing assignment, delete attachments, and upload new guide files"""
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

    # Support both JSON payload and FormData
    data = request.form if request.form else (request.get_json() or {})

    if 'title' in data and data.get('title', '').strip():
        assignment.title = data['title'].strip()
    if 'description' in data:
        assignment.description = data['description']
    if 'max_score' in data and str(data['max_score']).isdigit():
        assignment.max_score = int(data['max_score'])
    if 'language' in data and data.get('language'):
        assignment.language = data['language'].lower()
    
    if 'deadline' in data:
        if not data['deadline']:
            return jsonify({"error": "Assignment deadline is required. Please set a deadline."}), 400
        try:
            parsed_deadline = datetime.fromisoformat(data['deadline'].replace('Z', ''))
            if parsed_deadline < (datetime.utcnow() - timedelta(minutes=1)):
                return jsonify({"error": "Assignment deadline cannot be set in the past. Please choose a future date and time."}), 400
            assignment.deadline = parsed_deadline
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid deadline format provided."}), 400

    try:
        # 1. Process Deleted Attachments
        deleted_ids_raw = data.get('deleted_attachment_ids', [])
        if isinstance(deleted_ids_raw, str):
            deleted_ids = [int(i.strip()) for i in deleted_ids_raw.split(',') if i.strip().isdigit()]
        elif isinstance(deleted_ids_raw, list):
            deleted_ids = [int(i) for i in deleted_ids_raw if str(i).isdigit()]
        else:
            deleted_ids = []

        if deleted_ids:
            for att_id in deleted_ids:
                att = AssignmentAttachment.query.filter_by(id=att_id, assignment_id=assignment.id).first()
                if att:
                    try:
                        if att.file_path and os.path.exists(att.file_path):
                            os.remove(att.file_path)
                    except Exception as fe:
                        print(f"Notice: Could not delete physical guide file {att.file_path}: {fe}")
                    db.session.delete(att)
            db.session.flush()

        # 2. Process Newly Added Guide Files (Max total 3)
        new_files = [f for f in request.files.getlist('files') if f and f.filename != ''] if request.files else []
        current_attachments_count = AssignmentAttachment.query.filter_by(assignment_id=assignment.id).count()

        if current_attachments_count + len(new_files) > 3:
            return jsonify({"error": f"Total attachments cannot exceed 3. Currently have {current_attachments_count} and tried to add {len(new_files)}."}), 400

        # Validate newly uploaded guide files before saving
        for file in new_files:
            val_error = validate_guide_file(file)
            if val_error:
                return jsonify({"error": val_error}), 400

        for file in new_files:
            original_filename = secure_filename(file.filename)
            if not original_filename:
                original_filename = f"guide_{int(datetime.utcnow().timestamp())}{os.path.splitext(file.filename)[1]}"
            unique_filename = f"guide_assign_{assignment.id}_{original_filename}"
            attachments_dir = current_app.config.get('ATTACHMENTS_FOLDER', os.path.join(current_app.config['UPLOAD_FOLDER'], 'attachments'))
            os.makedirs(attachments_dir, exist_ok=True)
            filepath = os.path.join(attachments_dir, unique_filename)
            file.save(filepath)

            new_attachment = AssignmentAttachment(
                assignment_id=assignment.id,
                filename=original_filename,
                file_path=filepath
            )
            db.session.add(new_attachment)

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
        return jsonify({"error": f"Database error occurred while updating: {str(e)}"}), 500


@assignments_bp.route('/<int:class_id>/assignments/<int:assignment_id>/attachments/<int:attachment_id>', methods=['DELETE'])
@jwt_required()
def delete_assignment_attachment(class_id, assignment_id, attachment_id):
    """Allows an instructor to delete a specific guide file attachment"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'instructor':
        return jsonify({"error": "Unauthorized"}), 403

    classroom = Classroom.query.filter_by(id=class_id, instructor_id=user.id).first()
    if not classroom:
        return jsonify({"error": "Unauthorized or classroom not found"}), 403

    assignment = Assignment.query.filter_by(id=assignment_id, classroom_id=class_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found in this classroom"}), 404

    attachment = AssignmentAttachment.query.filter_by(id=attachment_id, assignment_id=assignment_id).first()
    if not attachment:
        return jsonify({"error": "Attachment not found"}), 404

    try:
        if attachment.file_path and os.path.exists(attachment.file_path):
            try:
                os.remove(attachment.file_path)
            except Exception as fe:
                print(f"Could not remove physical file: {fe}")

        db.session.delete(attachment)
        db.session.commit()
        return jsonify({"message": "Attachment deleted successfully", "id": attachment_id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete attachment"}), 500


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
        cleanup_assignment_files(assignment_id)
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

    attachment = AssignmentAttachment.query.join(Assignment).filter(
        AssignmentAttachment.id == attachment_id,
        Assignment.classroom_id == class_id
    ).first()
    if not attachment:
        return jsonify({"error": "Attachment record not found."}), 404

    # Robust file resolution: check absolute path, then upload directory candidates
    file_path = attachment.file_path
    if not os.path.exists(file_path):
        filename_only = os.path.basename(attachment.file_path)
        candidates = [
            os.path.join(current_app.config.get('ATTACHMENTS_FOLDER', 'uploads/attachments'), filename_only),
            os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'), filename_only),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', 'attachments', filename_only),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', filename_only),
            os.path.join(os.getcwd(), 'server', 'uploads', 'attachments', filename_only),
            os.path.join(os.getcwd(), 'server', 'uploads', filename_only),
            # Also check by original attachment filename
            os.path.join(current_app.config.get('ATTACHMENTS_FOLDER', 'uploads/attachments'), attachment.filename),
            os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'), attachment.filename),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', 'attachments', attachment.filename),
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', attachment.filename),
            os.path.join(os.getcwd(), 'server', 'uploads', 'attachments', attachment.filename),
            os.path.join(os.getcwd(), 'server', 'uploads', attachment.filename),
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
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.py': 'text/x-python',
        '.java': 'text/x-java-source',
        '.cpp': 'text/x-c',
        '.c': 'text/x-c',
        '.cs': 'text/plain',
        '.js': 'text/javascript',
        '.ts': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.sql': 'text/plain',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.csv': 'text/csv',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.zip': 'application/zip',
        '.tar': 'application/x-tar',
        '.gz': 'application/gzip',
        '.7z': 'application/x-7z-compressed',
        '.rar': 'application/vnd.rar'
    }
    mimetype = mime_map.get(ext) or mimetypes.guess_type(attachment.filename)[0] or 'application/octet-stream'

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