# =============================================================================
# TEST CASE 4: Valid Python BST Solution
# IT Expert Survey Section 2.A - Question 2 Demonstration (Positive Control)
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
