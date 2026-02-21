import os
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def get_ast_tokens(content):
    """
    Parses Python code into an Abstract Syntax Tree (AST) and flattens it into 
    structural tokens, ignoring variable names to resist simple identifier renaming.
    """
    try:
        tree = ast.parse(content)
        tokens = []
        # Walk through every node in the tree (Functions, Loops, Logic, etc.)
        for node in ast.walk(tree):
            node_type = type(node).__name__
            # Normalize IDs, Constants, and Function names to focus on structure
            if isinstance(node, ast.Name): tokens.append(f"{node_type}_ID")
            elif isinstance(node, ast.Constant): tokens.append(f"{node_type}_CONST")
            elif isinstance(node, ast.FunctionDef): tokens.append(f"{node_type}_FUNC")
            else: tokens.append(node_type)
        return tokens
    except:
        # Return empty if code is unparseable (though our earlier check prevents this)
        return []

def code_to_document(code):
    """
    Converts a list of structural tokens into a document of 4-gram strings.
    N-grams capture the local sequence of logic flow.
    """
    tokens = get_ast_tokens(code)
    n = 4 # Sequence length for structural matching
    if len(tokens) < n: return ""
    
    # Generate sliding window N-grams: [T1, T2, T3, T4], [T2, T3, T4, T5]...
    ngrams = [" ".join(tokens[i:i+n]) for i in range(len(tokens)-n+1)]
    return " ".join(ngrams)

def compare_all_files(file_data):
    """
    Thesis-Optimized: Vectorizes all documents together. 
    TF-IDF weighting works better when it can see the 'rarity' of 
    logic structures across the entire assignment batch.
    """
    if len(file_data) < 2: return []

    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]

    # sublinear_tf=True helps scale down the impact of repeated code (like boilerplates)
    vectorizer = TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True)
    
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        # Compute the similarity between every pair in the matrix
        sim_matrix = cosine_similarity(tfidf_matrix)

        results = []
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                score = round(sim_matrix[i][j] * 100, 2)
                
                # Assign status labels based on standard plagiarism thresholds
                status = "Low"
                if score > 70: status = "High"
                elif score > 40: status = "Medium"

                if score > 0:
                    results.append({
                        "file1": filenames[i], 
                        "file2": filenames[j], 
                        "score": score, 
                        "status": status
                    })
        
        # Sort by most suspicious matches first
        return sorted(results, key=lambda x: x['score'], reverse=True)
    except:
        return []