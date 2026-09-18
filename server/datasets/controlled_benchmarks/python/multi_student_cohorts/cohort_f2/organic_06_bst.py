# Organic BST Student Submission 06
class LinkedParentBST:
    class PNode:
        def __init__(self, key, parent=None):
            self.key = key; self.left = None; self.right = None; self.parent = parent
    
    def __init__(self): self.root = None

    def insert(self, key):
        if not self.root:
            self.root = self.PNode(key); return
        curr = self.root
        while True:
            if key < curr.key:
                if not curr.left: curr.left = self.PNode(key, curr); break
                curr = curr.left
            elif key > curr.key:
                if not curr.right: curr.right = self.PNode(key, curr); break
                curr = curr.right
            else: break
