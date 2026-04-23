import os
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Submission
# Ensure this matches your folder structure!
from utils.plagiarism import code_to_document, compare_all_files

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze/<int:assignment_id>', methods=['POST'])
@jwt_required()
def analyze_assignment(assignment_id):
    """
    Endpoint: POST /api/analyze/<assignment_id>
    Fetches all student submissions for a specific assignment from the 
    server disk and triggers the Falsicode AST-Ngram engine to detect structural plagiarism.
    """
    # 1. Fetch all submission records for this assignment from the database
    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    
    if len(submissions) < 2:
        return jsonify({"error": "Need at least 2 submissions to run analysis."}), 400

    # 2. Extract structural documents from the physical Python files
    processed_files = []
    for sub in submissions:
        # Security & Integrity Check: Prevent crashes from missing physical files
        if not sub.file_path or not os.path.exists(sub.file_path):
            print(f"Skipping {sub.filename}: No physical file found at {sub.file_path}")
            continue

        try:
            with open(sub.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                raw_content = f.read()
                
                doc_str = code_to_document(raw_content)
                
                if doc_str:
                    # Uses the db.relationship setup in your models.py
                    label = f"{sub.student.username} ({sub.filename})"
                    processed_files.append({
                        'name': label, 
                        'doc': doc_str, 
                        'raw_code': raw_content
                    })
        except Exception as e:
            print(f"Skipping file {sub.file_path} due to read error: {e}")

    # 3. Trigger the Falsicode Batch Analysis Engine
    results = compare_all_files(processed_files)

    # 4. Return the formatted report back to the React Dashboard
    return jsonify({
        "assignment_id": assignment_id,
        "matches_found": len(results),
        "results": results
    }), 200