class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._add(self.root, val)
        return self.root

    def _add(self, curr, val):
        if not curr:
            return TreeNode(val)
        if val < curr.val:
            curr.left = self._add(curr.left, val)
        else:
            curr.right = self._add(curr.right, val)
        return curr

    def search(self, val):
        curr = self.root
        while curr:
            if curr.val == val:
                return True
            curr = curr.left if val < curr.val else curr.right
        return False

    def inorder(self):
        res = []
        def traverse(node):
            if node:
                traverse(node.left)
                res.append(node.val)
                traverse(node.right)
        traverse(self.root)
        return res
