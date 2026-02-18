import os
import ast
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ==============================
# 1. SMART AST TOKENIZER
# ==============================
def get_ast_tokens(content):
    try:
        tree = ast.parse(content)
        tokens = []
        for node in ast.walk(tree):
            node_type = type(node).__name__
            if isinstance(node, ast.Name):
                tokens.append(f"{node_type}_ID")
            elif isinstance(node, ast.Constant):
                tokens.append(f"{node_type}_CONST")
            elif isinstance(node, ast.FunctionDef):
                tokens.append(f"{node_type}_FUNC")
            else:
                tokens.append(node_type)
        return tokens
    except:
        return []

# ==============================
# 2. DOCUMENT BUILDER
# ==============================
def code_to_document(code):
    tokens = get_ast_tokens(code)
    n = 4
    if len(tokens) < n:
        return ""
    ngrams = [" ".join(tokens[i:i+n]) for i in range(len(tokens)-n+1)]
    return " ".join(ngrams)

# ==============================
# 3. TF-IDF SIMILARITY (MATCHING PROTOTYPE)
# ==============================
def calculate_similarity(doc1, doc2):
    if not doc1 or not doc2:
        return 0.0
    
    # --- THIS WAS THE MISSING PART ---
    vectorizer = TfidfVectorizer(
        min_df=1,
        ngram_range=(1,2),
        sublinear_tf=True  # <--- This fixes the output difference!
    )
    
    try:
        tfidf_matrix = vectorizer.fit_transform([doc1, doc2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return sim * 100
    except:
        return 0.0

# ==============================
# 4. THE API ROUTE
# ==============================
@app.route('/api/upload', methods=['POST'])
def upload_files():
    if 'submissions' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('submissions')
    saved_paths = []

    # 1. Process Files
    for file in files:
        if file.filename == '': continue
        filename = secure_filename(file.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(path)
        
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                doc_str = code_to_document(f.read())
                saved_paths.append({'name': filename, 'doc': doc_str})
        except:
            pass

    results = []
    
    # 2. Compare Pairs
    for i in range(len(saved_paths)):
        for j in range(i + 1, len(saved_paths)):
            file_a = saved_paths[i]
            file_b = saved_paths[j]
            score = calculate_similarity(file_a['doc'], file_b['doc'])
            final_score = round(score, 2)
            
            status = "Low"
            if final_score > 70: status = "High"

            if final_score > 0:
                results.append({
                    "file1": file_a['name'],
                    "file2": file_b['name'],
                    "score": final_score,
                    "status": status
                })

    results.sort(key=lambda x: x['score'], reverse=True)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)