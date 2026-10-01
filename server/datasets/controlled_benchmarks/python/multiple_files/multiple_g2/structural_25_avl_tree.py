class AVLNode:
    def __init__(self, item):
        self.item = item
        self.left = None
        self.right = None
        self.ht = 1

class AVLTree:
    def insert(self, current, item):
        if not current:
            return AVLNode(item)
        if item < current.item:
            current.left = self.insert(current.left, item)
        elif item > current.item:
            current.right = self.insert(current.right, item)
        else:
            return current

        current.ht = 1 + max(self.get_height(current.left), self.get_height(current.right))
        bal = self.get_balance(current)

        if bal < -1 and item > current.right.item:
            return self.rot_left(current)
        if bal > 1 and item < current.left.item:
            return self.rot_right(current)
        if bal < -1 and item < current.right.item:
            current.right = self.rot_right(current.right)
            return self.rot_left(current)
        if bal > 1 and item > current.left.item:
            current.left = self.rot_left(current.left)
            return self.rot_right(current)
        return current

    def rot_left(self, x):
        y = x.right
        sub = y.left
        y.left = x
        x.right = sub
        x.ht = 1 + max(self.get_height(x.left), self.get_height(x.right))
        y.ht = 1 + max(self.get_height(y.left), self.get_height(y.right))
        return y

    def rot_right(self, y):
        x = y.left
        sub = x.right
        x.right = y
        y.left = sub
        y.ht = 1 + max(self.get_height(y.left), self.get_height(y.right))
        x.ht = 1 + max(self.get_height(x.left), self.get_height(x.right))
        return x

    def get_height(self, ptr):
        return ptr.ht if ptr else 0

    def get_balance(self, ptr):
        if not ptr:
            return 0
        return self.get_height(ptr.left) - self.get_height(ptr.right)
