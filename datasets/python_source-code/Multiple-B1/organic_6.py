# Binary Tree Traversal - organic submission 6
# Recursive in-order that builds the result by list concatenation instead
# of a shared mutable accumulator.

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


def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)


if __name__ == "__main__":
    root = None
    for v in [50, 30, 70, 20, 40, 60, 80]:
        root = insert(root, v)
    print("In-order (list concatenation):", inorder(root))
