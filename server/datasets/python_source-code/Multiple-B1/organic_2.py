# Binary Tree Traversal - organic submission 2
# In-order traversal implemented as a generator using yield from.

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def bst_insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = bst_insert(root.left, value)
    else:
        root.right = bst_insert(root.right, value)
    return root


def inorder_gen(node):
    if node is not None:
        yield from inorder_gen(node.left)
        yield node.value
        yield from inorder_gen(node.right)


def main():
    values = [50, 30, 70, 20, 40, 60, 80]
    root = None
    for v in values:
        root = bst_insert(root, v)
    print("In-order (generator):", list(inorder_gen(root)))


if __name__ == "__main__":
    main()
