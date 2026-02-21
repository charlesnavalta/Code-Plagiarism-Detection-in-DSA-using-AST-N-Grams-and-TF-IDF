import os
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required
from models import Submission, Assignment
from utils.plagiarism import code_to_document, compare_all_files

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze/<int:assignment_id>', methods=['POST'])
@jwt_required()
def analyze_assignment(assignment_id):
    """
    Endpoint: Fetches all student submissions for a specific assignment 
    from the server disk and runs the LogicGuard AST-Ngram engine.
    """
    # 1. Fetch records from DB
    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    
    if len(submissions) < 2:
        return jsonify({"error": "Need at least 2 submissions to run analysis."}), 400

    # 2. Process physical files into N-gram documents
    processed_files = []
    for sub in submissions:
        try:
            # We use errors='ignore' just in case of non-UTF8 characters in comments
            with open(sub.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                doc_str = code_to_document(f.read())
                if doc_str:
                    # Keep student name and filename for the report
                    label = f"{sub.student.username} ({sub.filename})"
                    processed_files.append({'name': label, 'doc': doc_str})
        except Exception as e:
            print(f"Skipping file {sub.file_path} due to read error: {e}")

    # 3. Trigger the Batch Analysis
    results = compare_all_files(processed_files)

    return jsonify({
        "assignment_id": assignment_id,
        "matches_found": len(results),
        "results": results
    })