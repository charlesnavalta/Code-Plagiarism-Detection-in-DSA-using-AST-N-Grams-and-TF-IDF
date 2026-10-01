class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
        self.ht = 1

class AVLTree:
    def update_height(self, node):
        node.ht = 1 + max(self.get_height(node.left), self.get_height(node.right))

    def insert(self, root, data):
        if not root:
            return TreeNode(data)
        if data < root.data:
            root.left = self.insert(root.left, data)
        elif data > root.data:
            root.right = self.insert(root.right, data)
        else:
            return root

        self.update_height(root)
        balance = self.get_balance(root)

        if balance > 1:
            if data < root.left.data:
                return self.right_rotate(root)
            root.left = self.left_rotate(root.left)
            return self.right_rotate(root)
        if balance < -1:
            if data > root.right.data:
                return self.left_rotate(root)
            root.right = self.right_rotate(root.right)
            return self.left_rotate(root)
        return root

    def right_rotate(self, y):
        x = y.left
        t2 = x.right
        x.right = y
        y.left = t2
        self.update_height(y)
        self.update_height(x)
        return x

    def left_rotate(self, x):
        y = x.right
        t2 = y.left
        y.left = x
        x.right = t2
        self.update_height(x)
        self.update_height(y)
        return y

    def get_height(self, node):
        if not node:
            return 0
        return node.ht

    def get_balance(self, node):
        if not node:
            return 0
        return self.get_height(node.left) - self.get_height(node.right)
