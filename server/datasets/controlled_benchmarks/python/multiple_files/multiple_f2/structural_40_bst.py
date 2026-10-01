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
        new_node = TreeNode(val)
        if not self.root:
            self.root = new_node
            self.size += 1
            return
        curr = self.root
        while True:
            if val < curr.val:
                if not curr.left:
                    curr.left = new_node
                    self.size += 1
                    break
                curr = curr.left
            elif val > curr.val:
                if not curr.right:
                    curr.right = new_node
                    self.size += 1
                    break
                curr = curr.right
            else:
                break

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
        result = []
        def _inorder(node: Optional[TreeNode]):
            if node:
                _inorder(node.left)
                result.append(node.val)
                _inorder(node.right)
        _inorder(self.root)
        return result

    def get_height(self) -> int:
        def _height(node: Optional[TreeNode]) -> int:
            if not node: return 0
            return 1 + max(_height(node.left), _height(node.right))
        return _height(self.root)
