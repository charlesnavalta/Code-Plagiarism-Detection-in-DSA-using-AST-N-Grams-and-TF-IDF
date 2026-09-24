# =============================================================================
# IT EXPERT EVALUATION - ERROR HANDLING DEMONSTRATION: CASE 4 (Positive Control)
# Scenario: Valid Python BST Implementation
# Target: Demonstrates successful, error-free parsing and AST tree generation baseline.
# =============================================================================

class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert_bst(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert_bst(root.left, key)
    else:
        root.right = insert_bst(root.right, key)
    return root
