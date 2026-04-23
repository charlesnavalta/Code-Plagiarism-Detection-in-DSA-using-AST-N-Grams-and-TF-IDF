import os
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ASTTokenExtractor(ast.NodeVisitor):
    def __init__(self):
        self.tokens = [] 

    def generic_visit(self, node):
        node_type = type(node).__name__
        lineno = getattr(node, 'lineno', -1)
        
        token_str = node_type
        if isinstance(node, ast.Name): 
            token_str = f"{node_type}_ID"
        elif isinstance(node, ast.Constant): 
            token_str = f"{node_type}_CONST"
        elif isinstance(node, ast.FunctionDef): 
            token_str = f"{node_type}_FUNC"
            
        if lineno != -1:
            self.tokens.append((token_str, lineno))
            
        ast.NodeVisitor.generic_visit(self, node)

def get_ast_tokens(content):
    try:
        tree = ast.parse(content)
        extractor = ASTTokenExtractor()
        extractor.visit(tree)
        return extractor.tokens
    except SyntaxError:
        return []

def code_to_document(code):
    tokens_with_lines = get_ast_tokens(code)
    return " ".join([t[0] for t in tokens_with_lines])

def compare_all_files(file_data):
    if len(file_data) < 2: 
        return []

    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]
    raw_codes = [f['raw_code'] for f in file_data] 

    vectorizer = TfidfVectorizer(ngram_range=(2, 4), sublinear_tf=True)
    
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        sim_matrix = cosine_similarity(tfidf_matrix)
        
        # EXTRACT THE MATH: Get every single N-gram the vectorizer learned
        feature_names = vectorizer.get_feature_names_out()

        results = []
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                score = round(sim_matrix[i][j] * 100, 2)
                
                status = "Low"
                if score > 70: 
                    status = "High"
                elif score > 40: 
                    status = "Medium"

                if score > 0:
                    # --- THE TF-IDF SYNCHRONIZED HIGHLIGHTER ---
                    vec_i = tfidf_matrix[i].toarray()[0]
                    vec_j = tfidf_matrix[j].toarray()[0]

                    # 1. Ask TF-IDF: Which specific N-grams matched between Charles and Nicolo?
                    shared_ngrams = set()
                    for idx in range(len(feature_names)):
                        # If both files have a score > 0 for this specific structural sequence
                        if vec_i[idx] > 0 and vec_j[idx] > 0:
                            shared_ngrams.add(feature_names[idx])

                    tokens_i = get_ast_tokens(raw_codes[i])
                    tokens_j = get_ast_tokens(raw_codes[j])

                    # 2. Map those exact math features back to the file's line numbers
                    def extract_lines_from_tfidf(tokens, shared_set):
                        highlighted_lines = set()
                        for n in [4, 3, 2]: # Check 4-grams, 3-grams, and 2-grams
                            for k in range(len(tokens) - n + 1):
                                # Format the token string exactly how TF-IDF formats it (lowercase)
                                ngram_str = " ".join([t[0].lower() for t in tokens[k:k+n]])
                                
                                # If this structural chunk was used in the % calculation, highlight it!
                                if ngram_str in shared_set:
                                    for t in tokens[k:k+n]:
                                        highlighted_lines.add(t[1])
                        return list(highlighted_lines)

                    lines_i = extract_lines_from_tfidf(tokens_i, shared_ngrams)
                    lines_j = extract_lines_from_tfidf(tokens_j, shared_ngrams)

                    results.append({
                        "file1": filenames[i], 
                        "file2": filenames[j], 
                        "score": score, 
                        "status": status,
                        "lines1": lines_i, 
                        "lines2": lines_j
                    })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)
    except ValueError:
        return []
    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        return []