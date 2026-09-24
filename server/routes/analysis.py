import os
import io
import zipfile
import traceback
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from models import Submission, Assignment, User
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
        os.path.join(server_dir, 'uploads', 'submissions', filename),
        os.path.join(server_dir, 'uploads', 'attachments', filename),
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
            ngram_bounds = (3, 5)  # Dense AST: trigrams to 5-grams
        else:
            from utils.python_engine import process_python_file
            process_func = process_python_file
            ngram_bounds = (3, 5)  # Trigrams to 5-grams: captures intent without bigram noise

        # 3. Fetch all submissions with student relationship eager-loaded
        submissions = Submission.query.options(
            joinedload(Submission.student)
        ).filter_by(assignment_id=assignment_id).all()
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


@analysis_bp.route('/analyze/batch', methods=['POST'])
@jwt_required()
def analyze_batch():
    """Allows instructors to upload a folder, numerous .py/.java files, or a .zip archive for instant batch analysis."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role not in ('instructor', 'admin'):
            return jsonify({"error": "Unauthorized. Only instructors and administrators can perform batch audits."}), 403

        uploaded_files = request.files.getlist('files')
        target_language = request.form.get('language', 'auto').lower()

        if not uploaded_files or len(uploaded_files) == 0:
            return jsonify({"error": "No files provided for batch analysis."}), 400

        collected_code_files = []

        for file_obj in uploaded_files:
            filename = file_obj.filename or 'unknown'
            if not filename or filename == '':
                continue

            # Support direct .zip archives
            if filename.lower().endswith('.zip'):
                try:
                    zip_bytes = io.BytesIO(file_obj.read())
                    with zipfile.ZipFile(zip_bytes, 'r') as zf:
                        for entry_name in zf.namelist():
                            if entry_name.startswith('__MACOSX/') or entry_name.endswith('/'):
                                continue
                            ext = os.path.splitext(entry_name)[1].lower()
                            if ext in ('.py', '.java'):
                                try:
                                    content_bytes = zf.read(entry_name)
                                    content_str = content_bytes.decode('utf-8', errors='ignore')
                                    if content_str.strip():
                                        inferred = 'python' if ext == '.py' else 'java'
                                        clean_name = os.path.basename(entry_name)
                                        collected_code_files.append({
                                            'filename': clean_name or entry_name,
                                            'path': entry_name,
                                            'content': content_str,
                                            'lang': inferred
                                        })
                                except Exception as ze:
                                    print(f"Error reading zip entry {entry_name}: {ze}")
                except Exception as ze:
                    print(f"Error extracting zip file {filename}: {ze}")
                continue

            ext = os.path.splitext(filename)[1].lower()
            if ext in ('.py', '.java'):
                try:
                    content_str = file_obj.read().decode('utf-8', errors='ignore')
                    if content_str.strip():
                        inferred = 'python' if ext == '.py' else 'java'
                        clean_name = os.path.basename(filename)
                        collected_code_files.append({
                            'filename': clean_name or filename,
                            'path': filename,
                            'content': content_str,
                            'lang': inferred
                        })
                except Exception as fe:
                    print(f"Error reading uploaded file {filename}: {fe}")

        if len(collected_code_files) < 2:
            return jsonify({
                "error": f"Batch audit requires at least 2 valid Python (.py) or Java (.java) source files. Successfully parsed {len(collected_code_files)} file(s)."
            }), 400

        # Determine target language strategy
        if target_language in ('python', 'java'):
            active_lang = target_language
        else:
            py_count = sum(1 for f in collected_code_files if f['lang'] == 'python')
            java_count = sum(1 for f in collected_code_files if f['lang'] == 'java')
            active_lang = 'java' if java_count > py_count else 'python'

        # Filter to selected language
        files_for_analysis = [f for f in collected_code_files if f['lang'] == active_lang]
        if len(files_for_analysis) < 2:
            return jsonify({
                "error": f"Need at least 2 {active_lang.capitalize()} files for batch comparison (found {len(files_for_analysis)})."
            }), 400

        if active_lang == 'java':
            from utils.java_engine import process_java_file
            process_func = process_java_file
            ngram_bounds = (3, 5)
        else:
            from utils.python_engine import process_python_file
            process_func = process_python_file
            ngram_bounds = (3, 5)

        processed_files = []
        for item in files_for_analysis:
            try:
                doc_str, tokens = process_func(item['content'])
                if doc_str and tokens:
                    processed_files.append({
                        'name': item['filename'],
                        'doc': doc_str,
                        'tokens': tokens,
                        'raw_code': item['content']
                    })
            except Exception as pe:
                print(f"Falsicode Batch Analysis: Error parsing {item['filename']}: {pe}")

        if len(processed_files) < 2:
            return jsonify({
                "error": f"Batch analysis requires at least 2 syntactically parsable code files. Successfully parsed {len(processed_files)} out of {len(files_for_analysis)} file(s)."
            }), 400

        results = compare_all_files(processed_files, ngram_bounds)

        return jsonify({
            "is_batch": True,
            "language_used": active_lang,
            "ngrams_used": ngram_bounds,
            "files_analyzed": len(processed_files),
            "files_list": [p['name'] for p in processed_files],
            "files_payload": [{"student_name": p["name"], "filename": p["name"], "content": p["raw_code"]} for p in processed_files],
            "matches_found": len(results),
            "results": results
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Batch plagiarism engine encountered an internal error: {str(e)}"}), 500