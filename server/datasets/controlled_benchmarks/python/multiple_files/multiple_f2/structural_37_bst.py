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
        self.root = self._insert_node(self.root, val)

    def _insert_node(self, curr: Optional[TreeNode], val: int) -> TreeNode:
        if not curr:
            self.size += 1
            return TreeNode(val)
        if val < curr.val:
            curr.left = self._insert_node(curr.left, val)
        elif val > curr.val:
            curr.right = self._insert_node(curr.right, val)
        return curr

    def search(self, target: int) -> bool:
        curr = self.root
        while curr:
            if curr.val == target:
                return True
            curr = curr.left if target < curr.val else curr.right
        return False

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

    def inorder_traversal(self) -> List[int]:
        elems = []
        self._inorder_walk(self.root, elems)
        return elems

    def _inorder_walk(self, node: Optional[TreeNode], acc: List[int]) -> None:
        if node:
            self._inorder_walk(node.left, acc)
            acc.append(node.val)
            self._inorder_walk(node.right, acc)

    def get_height(self) -> int:
        return self._calc_height(self.root)

    def _calc_height(self, node: Optional[TreeNode]) -> int:
        if not node: return 0
        return 1 + max(self._calc_height(node.left), self._calc_height(node.right))
