import javalang

def find_dead_nodes_java(tree):
    """
    Iteratively prunes the Java AST to find unreachable methods and unused local variables.
    """
    dead_node_ids = set()
    changed = True
    
    while changed:
        changed = False
        used_names = set()
        
        # Pass 1: Gather all invoked methods and referenced variables from ALIVE nodes
        for path, node in tree:
            # Skip if this node or any of its parents are marked dead
            if any(id(p) in dead_node_ids for p in path) or id(node) in dead_node_ids:
                continue
            
            node_type = type(node).__name__
            if node_type == "MethodInvocation" and hasattr(node, 'member'):
                used_names.add(node.member)
            elif node_type == "MemberReference" and hasattr(node, 'member'):
                used_names.add(node.member)
        
        # Pass 2: Identify newly dead declarations
        for path, node in tree:
            if any(id(p) in dead_node_ids for p in path) or id(node) in dead_node_ids:
                continue
                
            node_type = type(node).__name__
            
            if node_type == "MethodDeclaration":
                # Keep standard main entry points and used methods
                if node.name not in used_names and node.name != "main":
                    dead_node_ids.add(id(node))
                    changed = True
                    
            elif node_type == "LocalVariableDeclaration":
                all_dead = True
                for decl in node.declarators:
                    if decl.name in used_names:
                        all_dead = False
                if all_dead:
                    dead_node_ids.add(id(node))
                    changed = True
                    
    return dead_node_ids

def process_java_file(content):
    try:
        try:
            tree = javalang.parse.parse(content)
        except javalang.parser.JavaSyntaxError:
            tree = javalang.parse.parse(f"public class DummyClass {{ {content} }}")
    except Exception:
        return "", []

    java_to_python_map = {
        "MethodDeclaration": "FunctionDef_FUNC",
        "VariableDeclarator": "Name_ID",
        "MemberReference": "Name_ID",
        "Literal": "Constant_CONST",
        "ClassDeclaration": "ClassDef_CLASS",
        "MethodInvocation": "Call_CALL",
        "IfStatement": "If",
        "ForStatement": "For",
        "WhileStatement": "While",
        "ReturnStatement": "Return"
    }

    # New: Analyze reachability before extracting tokens
    dead_node_ids = find_dead_nodes_java(tree)

    # Exclusion set: Java AST node types that are syntactically mandatory in
    # virtually every Java program regardless of algorithmic approach.
    # Including these in TF-IDF gives them high IDF weight and causes innocent
    # pairs to accumulate shared tokens that look suspicious but are just
    # required Java boilerplate.
    #
    # TypeArgument       — generic type parameter, e.g. List<Node>
    # BasicType          — primitive types: int, boolean, char, etc.
    # ReferenceType      — object types: String, Node, etc.
    # TypeDeclaration    — top-level class/interface wrapper node
    # PackageDeclaration — mandatory "package foo.bar;" header
    # Annotation         — @Override, @SuppressWarnings, etc.
    # BlockStatement     — every method body is wrapped in a BlockStatement
    # StatementExpression— expression statements (i++, foo(), etc.)
    # ArrayCreator       — "new int[n]" / "new Node[n]" allocation
    # ClassCreator       — "new Node()" / "new LinkedList()" allocation
    # FormalParameter    — method parameter declarations
    JAVA_BOILERPLATE_NODES = {
        'TypeArgument', 'BasicType', 'ReferenceType', 'TypeDeclaration',
        'PackageDeclaration', 'Annotation', 'BlockStatement',
        'StatementExpression', 'ArrayCreator', 'ClassCreator',
        'FormalParameter',
    }

    tokens = []
    for path, node in tree:
        # Skip token generation for any dead code branches
        if any(id(p) in dead_node_ids for p in path) or id(node) in dead_node_ids:
            continue

        node_type = type(node).__name__

        # Skip mandatory Java boilerplate nodes (see exclusion set above)
        if node_type in JAVA_BOILERPLATE_NODES:
            continue

        token_str = java_to_python_map.get(node_type, node_type)
        lineno = node.position.line if hasattr(node, 'position') and node.position else -1

        raw_value = None
        if node_type == "VariableDeclarator":
            raw_value = getattr(node, 'name', None)
        elif node_type == "MemberReference":
            raw_value = getattr(node, 'member', None)
        elif node_type == "Literal":
            raw_value = getattr(node, 'value', None)

        tokens.append((token_str, lineno, raw_value))

    doc_str = " ".join([t[0] for t in tokens])
    return doc_str, tokens