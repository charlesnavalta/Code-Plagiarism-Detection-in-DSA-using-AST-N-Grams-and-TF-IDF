# Binary Tree Traversal - unique source, ITERATIVE family
# This is the second of two "true source" files for this test case. It
# should match exact_copy_iterative_1.py, but must NOT cross-match with
# the recursive family (unique_recursive_1.py / exact_copy_recursive_1.py
# / renamed_reordered_combo_1.py), even though both solve the same
# in-order traversal problem.

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


def inorder_iterative(root):
    result = []
    stack = []
    current = root
    while current is not None or stack:
        while current is not None:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.value)
        current = current.right
    return result


def build_tree(values):
    root = None
    for v in values:
        root = insert(root, v)
    return root


if __name__ == "__main__":
    values = [50, 30, 70, 20, 40, 60, 80]
    root = build_tree(values)
    result = inorder_iterative(root)
    print("In-order traversal (iterative):", result)
