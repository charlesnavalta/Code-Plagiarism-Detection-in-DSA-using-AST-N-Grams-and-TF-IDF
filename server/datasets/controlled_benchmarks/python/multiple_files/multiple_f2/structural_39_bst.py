from typing import Optional, List

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

class BinarySearchTreeSuite:
    def __init__(self):
        self.root: Optional[TreeNode] = None
        self.size = 0

    def insert(self, val: int) -> None:
        def _insert_rec(node: Optional[TreeNode], val: int) -> TreeNode:
            if not node:
                self.size += 1
                return TreeNode(val)
            # Inverted branch order
            if val > node.val:
                node.right = _insert_rec(node.right, val)
            elif val < node.val:
                node.left = _insert_rec(node.left, val)
            return node
        self.root = _insert_rec(self.root, val)

    def search(self, target: int) -> bool:
        curr = self.root
        while curr:
            if curr.val == target:
                return True
            curr = curr.right if target > curr.val else curr.left
        return False

    def find_min(self) -> Optional[int]:
        if self.root is None: return None
        ptr = self.root
        while ptr.left is not None:
            ptr = ptr.left
        return ptr.val

    def find_max(self) -> Optional[int]:
        if self.root is None: return None
        ptr = self.root
        while ptr.right is not None:
            ptr = ptr.right
        return ptr.val

    def inorder_traversal(self) -> List[int]:
        res = []
        def _walk(curr: Optional[TreeNode]):
            if curr:
                _walk(curr.left)
                res.append(curr.val)
                _walk(curr.right)
        _walk(self.root)
        return res

    def get_height(self) -> int:
        def _h(n: Optional[TreeNode]) -> int:
            return 0 if not n else (1 + max(_h(n.left), _h(n.right)))
        return _h(self.root)
