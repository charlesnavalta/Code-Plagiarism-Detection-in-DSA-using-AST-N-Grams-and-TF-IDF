import ast

class ASTTokenExtractor(ast.NodeVisitor):
    def __init__(self):
        self.tokens = [] 

    def generic_visit(self, node):
        node_type = type(node).__name__
        lineno = getattr(node, 'lineno', -1)
        
        token_str = node_type
        raw_value = None  # NEW: holds the actual identifier/literal value

        if isinstance(node, ast.Name): 
            token_str = "Name_ID"
            raw_value = node.id
        elif isinstance(node, ast.Constant): 
            token_str = "Constant_CONST"
            raw_value = repr(node.value)
        elif isinstance(node, ast.FunctionDef): 
            token_str = "FunctionDef_FUNC"
        elif isinstance(node, ast.Call): 
            token_str = "Call_CALL"
        elif isinstance(node, ast.ClassDef): 
            token_str = "ClassDef_CLASS"
            
        # NEW: 3-tuple instead of 2-tuple
        self.tokens.append((token_str, lineno, raw_value))
            
        ast.NodeVisitor.generic_visit(self, node)

def process_python_file(content):
    try:
        tree = ast.parse(content)
        extractor = ASTTokenExtractor()
        extractor.visit(tree)
        tokens = extractor.tokens
        doc_str = " ".join([t[0] for t in tokens])  # unchanged — still normalized
        return doc_str, tokens
    except SyntaxError:
        return "", []