class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def insert(self, root, key):
        if not root:
            return AVLNode(key)
        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        else:
            return root

        lh = self.get_height(root.left)
        rh = self.get_height(root.right)
        root.height = 1 + (lh if lh > rh else rh)
        balance = self.get_balance(root)

        if balance > 1 and key < root.left.key:
            return self.right_rotate(root)
        if balance < -1 and key > root.right.key:
            return self.left_rotate(root)
        if balance > 1 and key > root.left.key:
            root.left = self.left_rotate(root.left)
            return self.right_rotate(root)
        if balance < -1 and key < root.right.key:
            root.right = self.right_rotate(root.right)
            return self.left_rotate(root)
        return root

    def right_rotate(self, y):
        x = y.left
        t2 = x.right
        x.right = y
        y.left = t2
        lh_y = self.get_height(y.left)
        rh_y = self.get_height(y.right)
        y.height = 1 + (lh_y if lh_y > rh_y else rh_y)
        lh_x = self.get_height(x.left)
        rh_x = self.get_height(x.right)
        x.height = 1 + (lh_x if lh_x > rh_x else rh_x)
        return x

    def left_rotate(self, x):
        y = x.right
        t2 = y.left
        y.left = x
        x.right = t2
        lh_x = self.get_height(x.left)
        rh_x = self.get_height(x.right)
        x.height = 1 + (lh_x if lh_x > rh_x else rh_x)
        lh_y = self.get_height(y.left)
        rh_y = self.get_height(y.right)
        y.height = 1 + (lh_y if lh_y > rh_y else rh_y)
        return y

    def get_height(self, node):
        if not node:
            return 0
        return node.height

    def get_balance(self, node):
        if not node:
            return 0
        return self.get_height(node.left) - self.get_height(node.right)
