import ast

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