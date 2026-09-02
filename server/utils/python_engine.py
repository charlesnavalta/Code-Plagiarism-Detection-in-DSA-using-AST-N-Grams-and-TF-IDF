import ast

def find_dead_nodes_python(tree):
    # Module-scope functions, classes, and class methods are the algorithm's public surface,
    # not internal dead code, even if no __main__ block calls them.
    top_level_ids = {id(n) for n in tree.body}
    for n in tree.body:
        if isinstance(n, ast.ClassDef):
            for m in n.body:
                top_level_ids.add(id(m))

    dead_nodes = set()
    changed = True

    while changed:
        changed = False
        used_names = set()

        def visit_alive(node):
            if node in dead_nodes:
                return
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
                used_names.add(node.id)
            elif isinstance(node, ast.Attribute) and isinstance(node.ctx, ast.Load):
                used_names.add(node.attr)
            for child in ast.iter_child_nodes(node):
                visit_alive(child)

        visit_alive(tree)

        def check_dead(node):
            nonlocal changed
            if node in dead_nodes:
                return

            if isinstance(node, ast.FunctionDef):
                if (id(node) not in top_level_ids
                        and not node.name.startswith('__')
                        and node.name not in used_names):
                    dead_nodes.add(node)
                    changed = True

            elif isinstance(node, ast.Assign):
                if id(node) not in top_level_ids:
                    is_dead = True
                    for t in node.targets:
                        if isinstance(t, ast.Name):
                            if t.id in used_names:
                                is_dead = False
                        else:
                            is_dead = False
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
    except (SyntaxError, Exception):
        return "", []