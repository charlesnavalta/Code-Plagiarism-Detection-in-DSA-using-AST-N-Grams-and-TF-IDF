class AVLNode:
    def __init__(self, val):
        self.val = val
        self.l = None
        self.r = None
        self.h = 1

class AVLTree:
    def insert(self, root, val):
        if not root:
            return AVLNode(val)
        if val < root.val:
            root.l = self.insert(root.l, val)
        elif val > root.val:
            root.r = self.insert(root.r, val)
        else:
            return root

        root.h = 1 + max(self.node_h(root.l), self.node_h(root.r))
        diff = self.calc_diff(root)

        if diff < -1 and val < root.l.val:
            return self.rot_r(root)
        if diff > 1 and val > root.r.val:
            return self.rot_l(root)
        if diff < -1 and val > root.l.val:
            root.l = self.rot_l(root.l)
            return self.rot_r(root)
        if diff > 1 and val < root.r.val:
            root.r = self.rot_r(root.r)
            return self.rot_l(root)
        return root

    def calc_diff(self, n):
        if not n:
            return 0
        return self.node_h(n.r) - self.node_h(n.l)

    def node_h(self, n):
        return n.h if n else 0

    def rot_r(self, y):
        x = y.l
        s = x.r
        x.r = y
        y.l = s
        y.h = 1 + max(self.node_h(y.l), self.node_h(y.r))
        x.h = 1 + max(self.node_h(x.l), self.node_h(x.r))
        return x

    def rot_l(self, x):
        y = x.r
        s = y.l
        y.l = x
        x.r = s
        x.h = 1 + max(self.node_h(x.l), self.node_h(x.r))
        y.h = 1 + max(self.node_h(y.l), self.node_h(y.r))
        return y
