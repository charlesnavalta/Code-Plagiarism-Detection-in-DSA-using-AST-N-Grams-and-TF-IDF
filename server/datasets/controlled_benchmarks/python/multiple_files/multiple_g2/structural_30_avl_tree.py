class AVLNode:
    def __init__(self, k):
        self.k = k
        self.left_branch = None
        self.right_branch = None
        self.depth = 1

class AVLTree:
    def insert(self, root, val):
        if root is None:
            return AVLNode(val)
        if val < root.k:
            root.left_branch = self.insert(root.left_branch, val)
        elif val > root.k:
            root.right_branch = self.insert(root.right_branch, val)
        else:
            return root

        root.depth = 1 + max(self.height_val(root.left_branch), self.height_val(root.right_branch))
        bf = self.balance_val(root)

        if bf > 1 and val < root.left_branch.k:
            return self.rotate_cw(root)
        if bf < -1 and val > root.right_branch.k:
            return self.rotate_ccw(root)
        if bf > 1 and val > root.left_branch.k:
            root.left_branch = self.rotate_ccw(root.left_branch)
            return self.rotate_cw(root)
        if bf < -1 and val < root.right_branch.k:
            root.right_branch = self.rotate_cw(root.right_branch)
            return self.rotate_ccw(root)
        return root

    def height_val(self, n):
        return n.depth if n else 0

    def balance_val(self, n):
        return self.height_val(n.left_branch) - self.height_val(n.right_branch) if n else 0

    def rotate_cw(self, root):
        pivot = root.left_branch
        sub = pivot.right_branch
        pivot.right_branch = root
        root.left_branch = sub
        root.depth = 1 + max(self.height_val(root.left_branch), self.height_val(root.right_branch))
        pivot.depth = 1 + max(self.height_val(pivot.left_branch), self.height_val(pivot.right_branch))
        return pivot

    def rotate_ccw(self, root):
        pivot = root.right_branch
        sub = pivot.left_branch
        pivot.left_branch = root
        root.right_branch = sub
        root.depth = 1 + max(self.height_val(root.left_branch), self.height_val(root.right_branch))
        pivot.depth = 1 + max(self.height_val(pivot.left_branch), self.height_val(pivot.right_branch))
        return pivot
