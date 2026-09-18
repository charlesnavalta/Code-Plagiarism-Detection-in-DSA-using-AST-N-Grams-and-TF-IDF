# Binary Tree Traversal - organic submission 10
# Iterative in-order using a manual while-True/break loop and an explicit
# "pending" list instead of a variable literally named stack.

class Node:
    def __init__(self, item):
        self.item = item
        self.left = None
        self.right = None


def insert(root, item):
    if root is None:
        return Node(item)
    if item < root.item:
        root.left = insert(root.left, item)
    else:
        root.right = insert(root.right, item)
    return root


def inorder_walk(root):
    output = []
    pending = []
    walker = root
    while True:
        if walker is not None:
            pending.append(walker)
            walker = walker.left
            continue
        if not pending:
            break
        walker = pending.pop()
        output.append(walker.item)
        walker = walker.right
    return output


if __name__ == "__main__":
    root = None
    for i in [50, 30, 70, 20, 40, 60, 80]:
        root = insert(root, i)
    print("In-order (manual stack):", inorder_walk(root))
