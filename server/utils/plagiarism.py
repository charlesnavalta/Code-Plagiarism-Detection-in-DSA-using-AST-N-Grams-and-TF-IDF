import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def get_ast_tokens(content):
    try:
        tree = ast.parse(content)
        tokens = []
        for node in ast.walk(tree):
            node_type = type(node).__name__
            if isinstance(node, ast.Name): tokens.append(f"{node_type}_ID")
            elif isinstance(node, ast.Constant): tokens.append(f"{node_type}_CONST")
            elif isinstance(node, ast.FunctionDef): tokens.append(f"{node_type}_FUNC")
            else: tokens.append(node_type)
        return tokens
    except:
        return []

def code_to_document(code):
    tokens = get_ast_tokens(code)
    n = 4
    if len(tokens) < n: return ""
    ngrams = [" ".join(tokens[i:i+n]) for i in range(len(tokens)-n+1)]
    return " ".join(ngrams)

def calculate_similarity(doc1, doc2):
    if not doc1 or not doc2: return 0.0
    vectorizer = TfidfVectorizer(min_df=1, ngram_range=(1,2), sublinear_tf=True)
    try:
        tfidf_matrix = vectorizer.fit_transform([doc1, doc2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return sim * 100
    except:
        return 0.0