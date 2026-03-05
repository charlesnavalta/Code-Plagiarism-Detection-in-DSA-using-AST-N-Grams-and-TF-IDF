import os
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Submission
from utils.plagiarism import code_to_document, compare_all_files

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze/<int:assignment_id>', methods=['POST'])
@jwt_required()
def analyze_assignment(assignment_id):
    """
    Endpoint: /api/analyze/<assignment_id>
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
        # Security & Integrity Check: 
        # Prevent crashes caused by "ghost records" (database entries where the 
        # physical file was deleted or never successfully uploaded).
        if not sub.file_path or not os.path.exists(sub.file_path):
            print(f"Skipping {sub.filename}: No physical file found at {sub.file_path}")
            continue

        try:
            with open(sub.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                # FIX: Read the file content ONCE and store it in a variable
                raw_content = f.read()
                
                # Pass the variable to the document generator
                doc_str = code_to_document(raw_content)
                
                if doc_str:
                    label = f"{sub.student.username} ({sub.filename})"
                    processed_files.append({
                        'name': label, 
                        'doc': doc_str, 
                        'raw_code': raw_content # Now it safely passes the text to the line-finder!
                    })
        except Exception as e:
            print(f"Skipping file {sub.file_path} due to read error: {e}")

    # 3. Trigger the Falsicode Batch Analysis Engine
    results = compare_all_files(processed_files)

    # 4. Return the formatted report back to the Instructor Dashboard
    return jsonify({
        "assignment_id": assignment_id,
        "matches_found": len(results),
        "results": results
    })