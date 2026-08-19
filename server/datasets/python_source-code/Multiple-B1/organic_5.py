# Binary Tree Traversal - organic submission 5
# Iterative post-order using the two-stacks technique.

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


def insert(root, data):
    if root is None:
        return Node(data)
    if data < root.data:
        root.left = insert(root.left, data)
    else:
        root.right = insert(root.right, data)
    return root


def postorder_two_stacks(root):
    if root is None:
        return []
    stack1 = [root]
    stack2 = []
    while stack1:
        node = stack1.pop()
        stack2.append(node.data)
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    stack2.reverse()
    return stack2


if __name__ == "__main__":
    root = None
    for d in [50, 30, 70, 20, 40, 60, 80]:
        root = insert(root, d)
    print("Post-order (two stacks):", postorder_two_stacks(root))
