# Binary Tree Traversal - organic submission 7
# Iterative pre-order, OOP style with __repr__ and a running node count.

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

    def __repr__(self):
        return f"Node({self.val})"


class Tree:
    def __init__(self):
        self.root = None
        self.size = 0

    def insert(self, val):
        self.size += 1
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if node is None:
            return Node(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        else:
            node.right = self._insert(node.right, val)
        return node

    def preorder_iterative(self):
        if self.root is None:
            return []
        result = []
        stack = [self.root]
        while stack:
            node = stack.pop()
            result.append(node.val)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        return result


if __name__ == "__main__":
    t = Tree()
    for v in [50, 30, 70, 20, 40, 60, 80]:
        t.insert(v)
    print(f"tree size: {t.size}")
    print("Pre-order (iterative):", t.preorder_iterative())
