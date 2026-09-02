# Organic BST Student Submission 20
class AVLReadyBST:
    class AVLNode:
        def __init__(self, val):
            self.val = val; self.left = None; self.right = None; self.h = 1
    
    def __init__(self): self.root = None

    def height(self, node): return node.h if node else 0

    def insert(self, val):
        def _ins(node, val):
            if not node: return self.AVLNode(val)
            if val < node.val: node.left = _ins(node.left, val)
            elif val > node.val: node.right = _ins(node.right, val)
            node.h = 1 + max(self.height(node.left), self.height(node.right))
            return node
        self.root = _ins(self.root, val)

    def search(self, val):
        curr = self.root
        while curr:
            if curr.val == val: return True
            curr = curr.left if val < curr.val else curr.right
        return False
