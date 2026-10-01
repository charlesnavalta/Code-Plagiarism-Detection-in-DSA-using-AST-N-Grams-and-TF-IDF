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
        self.is_valid = True

    def insert(self, val: int) -> None:
        def _put(node: Optional[TreeNode], v: int) -> TreeNode:
            if node is None:
                self.size += 1
                return TreeNode(v)
            if v < node.val:
                node.left = _put(node.left, v)
            elif v > node.val:
                node.right = _put(node.right, v)
            return node
        self.root = _put(self.root, val)

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

    def find_min(self) -> Optional[int]:
        if self.root is None: return None
        curr = self.root
        while curr.left is not None:
            curr = curr.left
        return curr.val

    def find_max(self) -> Optional[int]:
        if self.root is None: return None
        curr = self.root
        while curr.right is not None:
            curr = curr.right
        return curr.val

    def inorder_traversal(self) -> List[int]:
        output_list = []
        def _inorder_helper(ptr: Optional[TreeNode]):
            if ptr is not None:
                _inorder_helper(ptr.left)
                output_list.append(ptr.val)
                _inorder_helper(ptr.right)
        _inorder_helper(self.root)
        return output_list

    def get_height(self) -> int:
        def _tree_depth(ptr: Optional[TreeNode]) -> int:
            if ptr is None: return 0
            return 1 + max(_tree_depth(ptr.left), _tree_depth(ptr.right))
        return _tree_depth(self.root)
