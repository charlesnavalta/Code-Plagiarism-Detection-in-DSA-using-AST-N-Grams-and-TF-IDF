"""
Binary Search Tree Suite: Structural Reordering & Helper Extraction
Author: Structural Variant (Type 3 of Mary)
"""
from typing import Optional, List

class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

class BinarySearchTreeSuite:
    def __init__(self):
        self.root = None; self.size = 0

    def inorder_traversal(self) -> List[int]:
        out = []
        st = []
        curr = self.root
        while curr or st:
            while curr:
                st.append(curr)
                curr = curr.left
            curr = st.pop()
            out.append(curr.val)
            curr = curr.right
        return out

    def search(self, target: int) -> bool:
        c = self.root
        while c:
            if c.val == target: return True
            c = c.left if target < c.val else c.right
        return False

    def insert(self, val: int) -> None:
        if not self.root:
            self.root = TreeNode(val); self.size += 1; return
        c = self.root
        while True:
            if val < c.val:
                if not c.left: c.left = TreeNode(val); self.size += 1; break
                c = c.left
            elif val > c.val:
                if not c.right: c.right = TreeNode(val); self.size += 1; break
                c = c.right
            else:
                break

    def get_height(self) -> int:
        if not self.root: return 0
        q = [self.root]
        h = 0
        while q:
            h += 1
            nxt = []
            for n in q:
                if n.left: nxt.append(n.left)
                if n.right: nxt.append(n.right)
            q = nxt
        return h
