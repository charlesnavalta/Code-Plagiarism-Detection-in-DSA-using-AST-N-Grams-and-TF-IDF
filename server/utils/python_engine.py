import ast

def find_dead_nodes_python(tree):
    """
    Iteratively prunes the AST to find unreachable functions and unused variables.
    """
    dead_nodes = set()
    changed = True
    
    while changed:
        changed = False
        used_names = set()
        
        # Pass 1: Gather all loaded (used) names from ALIVE nodes
        def visit_alive(node):
            if node in dead_nodes:
                return
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
                used_names.add(node.id)
            for child in ast.iter_child_nodes(node):
                visit_alive(child)
                
        visit_alive(tree)
        
        # Pass 2: Identify newly dead assignments or functions
        def check_dead(node):
            nonlocal changed
            if node in dead_nodes:
                return
                
            if isinstance(node, ast.FunctionDef):
                # Keep dunder methods (like __init__) and anything that is actually called/used
                if not node.name.startswith('__') and node.name not in used_names:
                    dead_nodes.add(node)
                    changed = True
                    
            elif isinstance(node, ast.Assign):
                # Check if this assignment is ever used
                is_dead = True
                for t in node.targets:
                    if isinstance(t, ast.Name):
                        if t.id in used_names:
                            is_dead = False
                    else:
                        is_dead = False # Keep complex targets (e.g., tuple unpacking) safe
                if is_dead:
                    dead_nodes.add(node)
                    changed = True
                    
            for child in ast.iter_child_nodes(node):
                check_dead(child)
                
        check_dead(tree)
        
    return dead_nodes

class ASTTokenExtractor(ast.NodeVisitor):
    def __init__(self, dead_nodes):
        self.tokens = [] 
        self.dead_nodes = dead_nodes # Nodes to skip during extraction

    def generic_visit(self, node):
        # Skip the entire branch if the node was classified as dead code
        if node in self.dead_nodes:
            return

        node_type = type(node).__name__
        lineno = getattr(node, 'lineno', -1)
        
        token_str = node_type
        raw_value = None  

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
            
        self.tokens.append((token_str, lineno, raw_value))
            
        ast.NodeVisitor.generic_visit(self, node)

def process_python_file(content):
    try:
        tree = ast.parse(content)
        
        # New: Analyze reachability before extracting tokens
        dead_nodes = find_dead_nodes_python(tree)
        
        extractor = ASTTokenExtractor(dead_nodes)
        extractor.visit(tree)
        
        tokens = extractor.tokens
        doc_str = " ".join([t[0] for t in tokens])
        return doc_str, tokens
    except SyntaxError:
        return "", []