# Binary Tree Traversal - organic submission 1
# Recursive pre-order, class-based BinaryTree wrapper.

class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, key):
        self.root = self._insert(self.root, key)

    def _insert(self, node, key):
        if node is None:
            return Node(key)
        if key < node.key:
            node.left = self._insert(node.left, key)
        else:
            node.right = self._insert(node.right, key)
        return node

    def preorder(self):
        result = []
        self._preorder(self.root, result)
        return result

    def _preorder(self, node, result):
        if node is None:
            return
        result.append(node.key)
        self._preorder(node.left, result)
        self._preorder(node.right, result)


if __name__ == "__main__":
    tree = BinaryTree()
    for k in [50, 30, 70, 20, 40, 60, 80]:
        tree.insert(k)
    print("Pre-order:", tree.preorder())
