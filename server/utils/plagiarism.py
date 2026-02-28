import os
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ASTTokenExtractor(ast.NodeVisitor):
    """
    A custom visitor that traverses the AST in Depth-First Search (DFS) order.
    This guarantees the tokens are generated in the actual execution flow of the logic,
    closing the 'Traversal Order Flaw' gap.
    """
    def __init__(self):
        self.tokens = []

    def generic_visit(self, node):
        node_type = type(node).__name__
        
        # Normalize IDs, Constants, and Function names to focus on structure
        if isinstance(node, ast.Name): 
            self.tokens.append(f"{node_type}_ID")
        elif isinstance(node, ast.Constant): 
            self.tokens.append(f"{node_type}_CONST")
        elif isinstance(node, ast.FunctionDef): 
            self.tokens.append(f"{node_type}_FUNC")
        else: 
            self.tokens.append(node_type)
            
        # Continue traversing down the tree to the children nodes
        ast.NodeVisitor.generic_visit(self, node)

def get_ast_tokens(content):
    """
    Parses Python code into an Abstract Syntax Tree (AST) and flattens it into 
    structural tokens in execution order, ignoring variable names to resist simple renaming.
    """
    try:
        tree = ast.parse(content)
        extractor = ASTTokenExtractor()
        extractor.visit(tree)
        return extractor.tokens
    except SyntaxError:
        # Return empty if code is unparseable
        return []

def code_to_document(code):
    """
    Converts the AST tokens into a flat, space-separated string.
    We let the TF-IDF Vectorizer handle the N-gram sliding window, 
    preventing the 'Double N-Gramming' logic flaw.
    """
    tokens = get_ast_tokens(code)
    return " ".join(tokens)

def compare_all_files(file_data):
    """
    Thesis-Optimized: Vectorizes all documents together using 4-Grams.
    TF-IDF weighting works better when it can see the 'rarity' of 
    logic structures across the entire assignment batch.
    """
    if len(file_data) < 2: 
        return []

    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]

    # Use exact 4-grams to capture logical sequences.
    # sublinear_tf=True helps scale down the impact of repeated boilerplate code.
    vectorizer = TfidfVectorizer(ngram_range=(4, 4), sublinear_tf=True)
    
    try:
        # If there are fewer tokens than the N-gram range, fit_transform will throw a ValueError
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # Compute the similarity between every pair in the matrix
        sim_matrix = cosine_similarity(tfidf_matrix)

        results = []
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                score = round(sim_matrix[i][j] * 100, 2)
                
                # Assign status labels based on standard plagiarism thresholds
                status = "Low"
                if score > 70: 
                    status = "High"
                elif score > 40: 
                    status = "Medium"

                if score > 0:
                    results.append({
                        "file1": filenames[i], 
                        "file2": filenames[j], 
                        "score": score, 
                        "status": status
                    })
        
        # Sort by most suspicious matches first
        return sorted(results, key=lambda x: x['score'], reverse=True)
    except ValueError:
        # Triggers if the submitted files are too short to form a single 4-gram
        return []
    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        return []