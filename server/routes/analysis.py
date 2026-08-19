import os
import traceback
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Submission, Assignment
from utils.similarity import compare_all_files

analysis_bp = Blueprint('analysis', __name__)

def resolve_submission_path(raw_path):
    """Dynamically resolves absolute or relative paths for both seeded datasets and uploaded student files."""
    if not raw_path:
        return None
    
    server_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__))) # server/
    root_dir = os.path.abspath(os.path.join(server_dir, '..'))
    
    # Normalize slashes
    normalized = raw_path.replace('\\', '/')
    filename = os.path.basename(normalized)
    
    candidates = [
        raw_path,
        os.path.join(server_dir, raw_path),
        os.path.join(server_dir, 'uploads', filename),
        os.path.join(root_dir, raw_path),
        os.path.join(server_dir, normalized),
        os.path.join(root_dir, normalized),
    ]
    
    # If the path is a dataset path (e.g. datasets/python_source-code/...)
    if 'datasets' in normalized:
        rel_dataset_path = normalized[normalized.find('datasets'):]
        candidates.append(os.path.join(server_dir, rel_dataset_path))
        candidates.append(os.path.join(root_dir, rel_dataset_path))
        
    for c in candidates:
        if c and os.path.exists(c) and os.path.isfile(c):
            return os.path.abspath(c)
            
    return None

@analysis_bp.route('/analyze/<int:assignment_id>', methods=['POST'])
@jwt_required()
def analyze_assignment(assignment_id):
    try:
        # 1. Fetch assignment to determine language
        assignment = Assignment.query.get(assignment_id)
        if not assignment:
            return jsonify({"error": "Assignment not found."}), 404
            
        language = (assignment.language or 'python').lower()
        
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
            return jsonify({"error": f"Need at least 2 student submissions to run plagiarism comparison (found {len(submissions)})."}), 400

        processed_files = []
        for sub in submissions:
            actual_path = resolve_submission_path(sub.file_path)
            
            if not actual_path:
                print(f"Falsicode Analysis Warning: Could not locate file on disk for submission ID {sub.id} (recorded path: {sub.file_path})")
                continue

            try:
                with open(actual_path, 'r', encoding='utf-8', errors='ignore') as f:
                    raw_content = f.read()
                    
                    if not raw_content.strip():
                        continue

                    # Use the dynamically selected engine!
                    doc_str, tokens = process_func(raw_content)
                    
                    if doc_str and tokens:
                        student_name = sub.student.username if sub.student else f"Student #{sub.student_id}"
                        label = f"{student_name} ({sub.filename})"
                        processed_files.append({
                            'name': label, 
                            'doc': doc_str, 
                            'tokens': tokens,
                            'raw_code': raw_content
                        })
            except Exception as e:
                print(f"Falsicode Analysis: Skipping file {actual_path} due to read/parse error: {e}")

        if len(processed_files) < 2:
            return jsonify({
                "error": f"Plagiarism analysis requires at least 2 readable code files. Successfully processed {len(processed_files)} out of {len(submissions)} submission(s)."
            }), 400

        # 4. Pass the files AND the dynamic ngram size to the shared math engine
        results = compare_all_files(processed_files, ngram_bounds)

        return jsonify({
            "assignment_id": assignment_id,
            "language_used": language,
            "ngrams_used": ngram_bounds,
            "matches_found": len(results),
            "results": results
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Plagiarism engine encountered an internal error: {str(e)}"}), 500