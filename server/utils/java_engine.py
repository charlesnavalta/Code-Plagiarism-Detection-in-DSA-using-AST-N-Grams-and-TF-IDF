import javalang

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

    tokens = []
    for path, node in tree:
        node_type = type(node).__name__
        
        if node_type not in ['TypeArgument']:
            token_str = java_to_python_map.get(node_type, node_type)
            lineno = node.position.line if hasattr(node, 'position') and node.position else -1

            # NEW: pull the actual raw value depending on node type
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