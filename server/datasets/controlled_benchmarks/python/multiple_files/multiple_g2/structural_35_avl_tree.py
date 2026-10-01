class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def double_lr(self, node):
        node.left = self.single_left(node.left)
        return self.single_right(node)

    def double_rl(self, node):
        node.right = self.single_right(node.right)
        return self.single_left(node)

    def insert(self, root, key):
        if root is None:
            return AVLNode(key)
        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        else:
            return root

        root.height = 1 + max(self.h(root.left), self.h(root.right))
        bf = self.b(root)

        if bf > 1 and key < root.left.key:
            return self.single_right(root)
        if bf < -1 and key > root.right.key:
            return self.single_left(root)
        if bf > 1 and key > root.left.key:
            return self.double_lr(root)
        if bf < -1 and key < root.right.key:
            return self.double_rl(root)
        return root

    def single_right(self, y):
        x = y.left
        t = x.right
        x.right = y
        y.left = t
        y.height = 1 + max(self.h(y.left), self.h(y.right))
        x.height = 1 + max(self.h(x.left), self.h(x.right))
        return x

    def single_left(self, x):
        y = x.right
        t = y.left
        y.left = x
        x.right = t
        x.height = 1 + max(self.h(x.left), self.h(x.right))
        y.height = 1 + max(self.h(y.left), self.h(y.right))
        return y

    def h(self, n):
        return n.height if n is not None else 0

    def b(self, n):
        return (self.h(n.left) - self.h(n.right)) if n is not None else 0
