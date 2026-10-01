class NodeAVL:
    def __init__(self, item_val):
        self.item_val = item_val
        self.l = None
        self.r = None
        self.height = 1

class AVLTree:
    def insert(self, root, val):
        if not root:
            return NodeAVL(val)
        if val < root.item_val:
            root.l = self.insert(root.l, val)
        elif val > root.item_val:
            root.r = self.insert(root.r, val)
        else:
            return root
        root.height = 1 + max(self.get_height(root.l), self.get_height(root.r))
        return self.rebalance(root, val)

    def rebalance(self, root, val):
        b = self.get_balance(root)
        if b > 1:
            if val < root.l.item_val:
                return self.turn_right(root)
            root.l = self.turn_left(root.l)
            return self.turn_right(root)
        if b < -1:
            if val > root.r.item_val:
                return self.turn_left(root)
            root.r = self.turn_right(root.r)
            return self.turn_left(root)
        return root

    def turn_right(self, y):
        x = y.l
        sub = x.r
        x.r = y
        y.l = sub
        y.height = 1 + max(self.get_height(y.l), self.get_height(y.r))
        x.height = 1 + max(self.get_height(x.l), self.get_height(x.r))
        return x

    def turn_left(self, x):
        y = x.r
        sub = y.l
        y.l = x
        x.r = sub
        x.height = 1 + max(self.get_height(x.l), self.get_height(x.r))
        y.height = 1 + max(self.get_height(y.l), self.get_height(y.r))
        return y

    def get_height(self, p):
        return p.height if p else 0

    def get_balance(self, p):
        return (self.get_height(p.l) - self.get_height(p.r)) if p else 0
