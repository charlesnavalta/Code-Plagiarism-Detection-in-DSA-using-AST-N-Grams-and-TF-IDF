"""
=============================================================================
FALSICODE: File Management & Physical Storage Cleanup Utilities
=============================================================================
Manages physical file operations, safe deletions, and orphan file cleanups
for student code submissions and instructor assignment attachments.
=============================================================================
"""

import os
from flask import current_app
from database import db
from models import Submission, AssignmentAttachment, Assignment, Classroom


def safely_delete_file(raw_path):
    """
    Safely deletes a physical file from disk.
    Tolerates missing files, None, path variations, and prevents crashes.
    """
    if not raw_path:
        return False

    # 1. Direct path check
    if os.path.isfile(raw_path):
        try:
            os.remove(raw_path)
            return True
        except Exception as e:
            print(f"Warning: Failed to delete file {raw_path}: {e}")
            return False

    # 2. Check within configured UPLOAD_FOLDER and its subfolders
    upload_folder = current_app.config.get('UPLOAD_FOLDER', '') if current_app else ''
    if upload_folder:
        clean_filename = os.path.basename(str(raw_path).replace('\\', '/'))
        candidates = [
            os.path.join(upload_folder, 'submissions', clean_filename),
            os.path.join(upload_folder, 'attachments', clean_filename),
            os.path.join(upload_folder, clean_filename)
        ]
        for candidate in candidates:
            if os.path.isfile(candidate):
                try:
                    os.remove(candidate)
                    return True
                except Exception as e:
                    print(f"Warning: Failed to delete file {candidate}: {e}")
                    return False

    return False


def cleanup_assignment_files(assignment_id):
    """
    Deletes all physical submission and attachment files associated with an assignment.
    Must be called BEFORE db.session.delete(assignment) so records can be queried.
    """
    deleted_count = 0
    try:
        # Clean up student submissions
        submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
        for sub in submissions:
            if sub.file_path and safely_delete_file(sub.file_path):
                deleted_count += 1

        # Clean up instructor attachments
        attachments = AssignmentAttachment.query.filter_by(assignment_id=assignment_id).all()
        for att in attachments:
            if att.file_path and safely_delete_file(att.file_path):
                deleted_count += 1
    except Exception as e:
        print(f"Warning: Error during assignment file cleanup for ID {assignment_id}: {e}")

    return deleted_count


def cleanup_classroom_files(classroom_id):
    """
    Deletes all physical files for all assignments belonging to a classroom.
    Must be called BEFORE db.session.delete(classroom).
    """
    total_deleted = 0
    try:
        assignments = Assignment.query.filter_by(classroom_id=classroom_id).all()
        for assign in assignments:
            total_deleted += cleanup_assignment_files(assign.id)
    except Exception as e:
        print(f"Warning: Error during classroom file cleanup for ID {classroom_id}: {e}")

    return total_deleted


def scan_and_clean_orphaned_uploads(dry_run=True):
    """
    Scans the UPLOAD_FOLDER and identifies files that are no longer referenced
    by any active Submission or AssignmentAttachment in the database.
    
    If dry_run is True, only returns the list of orphans without deleting.
    If dry_run is False, physically removes the orphans from disk.
    """
    upload_folder = current_app.config.get('UPLOAD_FOLDER', '') if current_app else ''
    if not upload_folder or not os.path.exists(upload_folder):
        return {"orphans": [], "deleted": 0}

    # Fetch all active file basenames recorded in the DB
    active_filenames = set()
    try:
        sub_paths = db.session.query(Submission.file_path).all()
        for (p,) in sub_paths:
            if p:
                active_filenames.add(os.path.basename(str(p).replace('\\', '/')))

        att_paths = db.session.query(AssignmentAttachment.file_path).all()
        for (p,) in att_paths:
            if p:
                active_filenames.add(os.path.basename(str(p).replace('\\', '/')))
    except Exception as e:
        print(f"Error querying active database file paths: {e}")
        return {"orphans": [], "deleted": 0, "error": str(e)}

    # Always preserve .gitkeep
    active_filenames.add('.gitkeep')

    orphans = []
    deleted = 0

    # Scan root uploads, submissions, and attachments folders
    scan_dirs = [
        upload_folder,
        os.path.join(upload_folder, 'submissions'),
        os.path.join(upload_folder, 'attachments')
    ]

    for s_dir in scan_dirs:
        if not os.path.exists(s_dir):
            continue
        for fname in os.listdir(s_dir):
            fpath = os.path.join(s_dir, fname)
            if not os.path.isfile(fpath):
                continue
            if fname not in active_filenames:
                rel_display = os.path.relpath(fpath, upload_folder).replace('\\', '/')
                orphans.append(rel_display)
                if not dry_run:
                    try:
                        os.remove(fpath)
                        deleted += 1
                    except Exception as err:
                        print(f"Failed to remove orphan file {fpath}: {err}")

    return {
        "orphans": orphans,
        "deleted": deleted,
        "dry_run": dry_run
    }
