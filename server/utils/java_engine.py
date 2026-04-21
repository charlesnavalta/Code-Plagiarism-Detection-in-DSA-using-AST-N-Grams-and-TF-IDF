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

    tokens = []
    for path, node in tree:
        node_type = type(node).__name__
        # Ignore boilerplate/literals to focus purely on structural logic
        if node_type not in ['Literal', 'MemberReference', 'TypeArgument']:
            # Attempt to extract line number for highlighting
            lineno = node.position.line if hasattr(node, 'position') and node.position else -1
            tokens.append((node_type, lineno))
            
    doc_str = " ".join([t[0] for t in tokens])
    return doc_str, tokens