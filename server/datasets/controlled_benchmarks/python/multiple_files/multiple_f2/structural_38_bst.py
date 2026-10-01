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

    def get_height(self) -> int:
        def _height(node: Optional[TreeNode]) -> int:
            if not node: return 0
            return 1 + max(_height(node.left), _height(node.right))
        return _height(self.root)

    def inorder_traversal(self) -> List[int]:
        result = []
        def _inorder(node: Optional[TreeNode]):
            if node:
                _inorder(node.left)
                result.append(node.val)
                _inorder(node.right)
        _inorder(self.root)
        return result

    def search(self, target: int) -> bool:
        curr = self.root
        while curr is not None:
            if curr.val == target:
                return True
            if target < curr.val:
                curr = curr.left
            else:
                curr = curr.right
        return False

    def insert(self, val: int) -> None:
        def _insert_rec(node: Optional[TreeNode], v: int) -> TreeNode:
            if not node:
                self.size += 1
                return TreeNode(v)
            if v < node.val:
                node.left = _insert_rec(node.left, v)
            elif v > node.val:
                node.right = _insert_rec(node.right, v)
            return node
        self.root = _insert_rec(self.root, val)

    def find_min(self) -> Optional[int]:
        if not self.root: return None
        curr = self.root
        while curr.left:
            curr = curr.left
        return curr.val

    def find_max(self) -> Optional[int]:
        if not self.root: return None
        curr = self.root
        while curr.right:
            curr = curr.right
        return curr.val
