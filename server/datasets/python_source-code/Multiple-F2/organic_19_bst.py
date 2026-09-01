# Standard iterative/recursive BST
class CustomNode_18:
    def __init__(self, item_val=0, left=None, right=None):
        self.item_val = item_val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = CustomNode_18(val)
            return self.root
        curr = self.root
        while True:
            if val < curr.item_val:
                if not curr.left:
                    curr.left = CustomNode_18(val)
                    break
                curr = curr.left
            else:
                if not curr.right:
                    curr.right = CustomNode_18(val)
                    break
                curr = curr.right
        return self.root

    def search(self, val):
        curr = self.root
        while curr:
            if curr.item_val == val:
                return True
            curr = curr.left if val < curr.item_val else curr.right
        return False

    def inorder(self):
        res = []
        def traverse(node):
            if node:
                traverse(node.left)
                res.append(node.item_val)
                traverse(node.right)
        traverse(self.root)
        return res
