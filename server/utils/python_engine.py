import ast

class ASTTokenExtractor(ast.NodeVisitor):
    def __init__(self):
        self.tokens = [] 

    def generic_visit(self, node):
        node_type = type(node).__name__
        # Default to -1 if the node (like a math operator) has no line number
        lineno = getattr(node, 'lineno', -1)
        
        token_str = node_type
        
        # --- THE FIX 1: Restored full sanitization to match Java ---
        if isinstance(node, ast.Name): 
            token_str = "Name_ID"
        elif isinstance(node, ast.Constant): 
            token_str = "Constant_CONST"
        elif isinstance(node, ast.FunctionDef): 
            token_str = "FunctionDef_FUNC"
        elif isinstance(node, ast.Call): 
            token_str = "Call_CALL"
        elif isinstance(node, ast.ClassDef): 
            token_str = "ClassDef_CLASS"
            
        # --- THE FIX 2: NO IF STATEMENT ---
        # We MUST append every single node to preserve structural integrity.
        self.tokens.append((token_str, lineno))
            
        ast.NodeVisitor.generic_visit(self, node)

def process_python_file(content):
    """Returns the document string and the raw tokens with lines."""
    try:
        tree = ast.parse(content)
        extractor = ASTTokenExtractor()
        extractor.visit(tree)
        tokens = extractor.tokens
        doc_str = " ".join([t[0] for t in tokens])
        return doc_str, tokens
    except SyntaxError:
        return "", []