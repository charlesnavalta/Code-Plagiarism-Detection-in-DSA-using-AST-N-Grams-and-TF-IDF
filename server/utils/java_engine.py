import javalang

def process_java_file(content):
    """Returns the document string and the raw tokens with lines for Java."""
    try:
        try:
            tree = javalang.parse.parse(content)
        except javalang.parser.JavaSyntaxError:
            # Fallback if the student just submitted a raw method
            tree = javalang.parse.parse(f"public class DummyClass {{ {content} }}")
    except Exception:
        return "", []

    # --- THE FIX: Cross-Language Dictionary Mapping ---
    # We must force Java AST nodes to speak "Python AST" so TF-IDF can match them.
    java_to_python_map = {
        "MethodDeclaration": "FunctionDef_FUNC",
        "VariableDeclarator": "Name_ID",
        "MemberReference": "Name_ID",       # Don't ignore this! It's a variable usage.
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
        
        # We only ignore TypeArguments now to keep the logic clean
        if node_type not in ['TypeArgument']:
            
            # Map the Java node to the Python equivalent if it exists in our dictionary
            token_str = java_to_python_map.get(node_type, node_type)
            
            lineno = node.position.line if hasattr(node, 'position') and node.position else -1
            tokens.append((token_str, lineno))
            
    doc_str = " ".join([t[0] for t in tokens])
    return doc_str, tokens