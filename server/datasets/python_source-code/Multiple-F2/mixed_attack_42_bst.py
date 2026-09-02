"""
Binary Search Tree Suite: Mixed Attack (Renaming + Dead Code + Reordering)
Author: Mixed Variant (Type 3 of Mary)
"""
from typing import Optional, List

class TreeNode:
    def __init__(self, val: int = 0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

class BinarySearchTreeSuite:
    def __init__(self):
        self._audit = []
        self.root = None
        self.size = 0

    def get_height(self) -> int:
        if not self.root: return 0
        # Dummy dead code calculation
        dummy = [x * 0 for x in range(5)]
        if sum(dummy) != 0: self._audit.append("dead")
        def _h(n): return 0 if not n else 1 + max(_h(n.left), _h(n.right))
        return _h(self.root)

    def insert(self, val: int) -> None:
        def _ins(n, v):
            if not n: self.size += 1; return TreeNode(v)
            if v < n.val: n.left = _ins(n.left, v)
            elif v > n.val: n.right = _ins(n.right, v)
            return n
        self.root = _ins(self.root, val)

    def search(self, target: int) -> bool:
        curr = self.root
        while curr:
            if curr.val == target: return True
            curr = curr.left if target < curr.val else curr.right
        return False

    def inorder_traversal(self) -> List[int]:
        res = []
        def _tr(n):
            if n: _tr(n.left); res.append(n.val); _tr(n.right)
        _tr(self.root)
        return res
