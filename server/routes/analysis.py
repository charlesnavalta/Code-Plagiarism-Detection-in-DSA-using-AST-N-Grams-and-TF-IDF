import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from utils.plagiarism import code_to_document, calculate_similarity

# We use a Blueprint to organize routes
analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/upload', methods=['POST'])
def upload_files():
    if 'submissions' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('submissions')
    saved_paths = []
    upload_folder = current_app.config['UPLOAD_FOLDER']

    for file in files:
        if file.filename == '': continue
        filename = secure_filename(file.filename)
        path = os.path.join(upload_folder, filename)
        file.save(path)
        
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                doc_str = code_to_document(f.read())
                saved_paths.append({'name': filename, 'doc': doc_str})
        except: pass

    results = []
    for i in range(len(saved_paths)):
        for j in range(i + 1, len(saved_paths)):
            file_a = saved_paths[i]
            file_b = saved_paths[j]
            score = calculate_similarity(file_a['doc'], file_b['doc'])
            final_score = round(score, 2)
            
            status = "Low"
            if final_score > 70: status = "High"
            if final_score > 0:
                results.append({"file1": file_a['name'], "file2": file_b['name'], "score": final_score, "status": status})

    results.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(results)