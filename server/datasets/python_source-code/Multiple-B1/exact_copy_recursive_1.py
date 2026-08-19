# Binary Tree Traversal - unique source, RECURSIVE family
# This is one of two "true source" files for this test case. It should
# match exact_copy_recursive_1.py and (partially, via disguise) match
# renamed_reordered_combo_1.py - but must NOT cross-match with the
# iterative family (unique_iterative_1.py / exact_copy_iterative_1.py).

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root


def inorder_recursive(node, result):
    if node is None:
        return
    inorder_recursive(node.left, result)
    result.append(node.value)
    inorder_recursive(node.right, result)


def build_tree(values):
    root = None
    for v in values:
        root = insert(root, v)
    return root


if __name__ == "__main__":
    values = [50, 30, 70, 20, 40, 60, 80]
    root = build_tree(values)
    result = []
    inorder_recursive(root, result)
    print("In-order traversal (recursive):", result)
