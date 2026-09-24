# Binary Tree Traversal - organic submission 9
# Recursive pre-order via static methods, plus an assert-based self-test.

class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class TreeOps:
    @staticmethod
    def insert(node, key):
        if node is None:
            return Node(key)
        if key < node.key:
            node.left = TreeOps.insert(node.left, key)
        else:
            node.right = TreeOps.insert(node.right, key)
        return node

    @staticmethod
    def preorder(node):
        if node is None:
            return []
        return [node.key] + TreeOps.preorder(node.left) + TreeOps.preorder(node.right)


def _self_test():
    root = None
    for k in [2, 1, 3]:
        root = TreeOps.insert(root, k)
    assert TreeOps.preorder(root) == [2, 1, 3]
    print("self-test passed")


if __name__ == "__main__":
    _self_test()
    root = None
    for k in [50, 30, 70, 20, 40, 60, 80]:
        root = TreeOps.insert(root, k)
    print("Pre-order:", TreeOps.preorder(root))
