class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def rotate_left_right(self, root):
        root.left = self.left_rotate(root.left)
        return self.right_rotate(root)

    def rotate_right_left(self, root):
        root.right = self.right_rotate(root.right)
        return self.left_rotate(root)

    def insert(self, root, key):
        if not root:
            return AVLNode(key)
        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        else:
            return root

        root.height = 1 + max(self.get_height(root.left), self.get_height(root.right))
        bal = self.get_balance(root)

        if bal > 1 and key < root.left.key:
            return self.right_rotate(root)
        if bal < -1 and key > root.right.key:
            return self.left_rotate(root)
        if bal > 1 and key > root.left.key:
            return self.rotate_left_right(root)
        if bal < -1 and key < root.right.key:
            return self.rotate_right_left(root)
        return root

    def right_rotate(self, y):
        x = y.left
        t2 = x.right
        x.right = y
        y.left = t2
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        return x

    def left_rotate(self, x):
        y = x.right
        t2 = y.left
        y.left = x
        x.right = t2
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        return y

    def get_height(self, node):
        return 0 if not node else node.height

    def get_balance(self, node):
        return (self.get_height(node.left) - self.get_height(node.right)) if node else 0
