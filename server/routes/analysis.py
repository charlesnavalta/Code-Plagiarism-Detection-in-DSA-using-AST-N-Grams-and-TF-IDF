import os
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Submission, Assignment
from utils.similarity import compare_all_files

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze/<int:assignment_id>', methods=['POST'])
@jwt_required()
def analyze_assignment(assignment_id):
    # 1. Fetch assignment to determine language
    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return jsonify({"error": "Assignment not found."}), 404
        
    language = assignment.language.lower()
    
    # 2. SELECT THE STRATEGY (Dynamic N-Grams and Engine)
    if language == 'java':
        from utils.java_engine import process_java_file
        process_func = process_java_file
        ngram_bounds = (3, 5) # Dense AST: Use larger N-Grams
    else:
        from utils.python_engine import process_python_file
        process_func = process_python_file
        ngram_bounds = (2, 4) # Concise AST: Use smaller N-Grams

    # 3. Fetch all submissions
    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    if len(submissions) < 2:
        return jsonify({"error": "Need at least 2 submissions to run analysis."}), 400

    processed_files = []
    for sub in submissions:
        if not sub.file_path or not os.path.exists(sub.file_path):
            continue

        try:
            with open(sub.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                raw_content = f.read()
                
                # Use the dynamically selected engine!
                doc_str, tokens = process_func(raw_content)
                
                if doc_str and tokens:
                    label = f"{sub.student.username} ({sub.filename})"
                    processed_files.append({
                        'name': label, 
                        'doc': doc_str, 
                        'tokens': tokens,
                        'raw_code': raw_content
                    })
        except Exception as e:
            print(f"Skipping file {sub.file_path} due to read error: {e}")

    # 4. Pass the files AND the dynamic ngram size to the shared math engine
    results = compare_all_files(processed_files, ngram_bounds)

    return jsonify({
        "assignment_id": assignment_id,
        "language_used": language,
        "ngrams_used": ngram_bounds,
        "matches_found": len(results),
        "results": results
    }), 200