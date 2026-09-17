# =============================================================================
# TEST CASE 1: Python Syntax Error (Deliberate unclosed parenthesis & colon)
# IT Expert Survey Section 2.A - Question 2 Demonstration
# =============================================================================

def find_bst_minimum(root):
    if root is None:
        return None
    
    current = root
    # INTENTIONAL SYNTAX ERROR ON LINE 12 (Missing closing parenthesis):
    while (current.left is not None:
        current = current.left
        
    return current.val
