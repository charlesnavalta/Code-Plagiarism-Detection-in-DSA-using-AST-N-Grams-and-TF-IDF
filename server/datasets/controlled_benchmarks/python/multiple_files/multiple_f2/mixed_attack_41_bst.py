from typing import Optional, List

class NodeItem:
    def __init__(self, data_val: int = 0, l_child: Optional['NodeItem'] = None, r_child: Optional['NodeItem'] = None):
        self.val = data_val
        self.left = l_child
        self.right = r_child

class BinarySearchTreeSuite:
    def __init__(self):
        self.root: Optional[NodeItem] = None
        self.size = 0
        self._op_count = 0

    def insert(self, key_val: int) -> None:
        self._op_count += 1
        def _add_rec(curr_ptr: Optional[NodeItem], v: int) -> NodeItem:
            if not curr_ptr:
                self.size += 1
                return NodeItem(v)
            if v < curr_ptr.val:
                curr_ptr.left = _add_rec(curr_ptr.left, v)
            elif v > curr_ptr.val:
                curr_ptr.right = _add_rec(curr_ptr.right, v)
            return curr_ptr
        self.root = _add_rec(self.root, key_val)

    def search(self, query: int) -> bool:
        self._op_count += 1
        ptr = self.root
        while ptr:
            if ptr.val == query:
                return True
            ptr = ptr.left if query < ptr.val else ptr.right
        return False

    def find_min(self) -> Optional[int]:
        if not self.root: return None
        ptr = self.root
        while ptr.left:
            ptr = ptr.left
        return ptr.val

    def find_max(self) -> Optional[int]:
        if not self.root: return None
        ptr = self.root
        while ptr.right:
            ptr = ptr.right
        return ptr.val

    def inorder_traversal(self) -> List[int]:
        collected = []
        def _visit(n: Optional[NodeItem]):
            if n:
                _visit(n.left)
                collected.append(n.val)
                _visit(n.right)
        _visit(self.root)
        return collected

    def get_height(self) -> int:
        def _calc_h(n: Optional[NodeItem]) -> int:
            if not n: return 0
            return 1 + max(_calc_h(n.left), _calc_h(n.right))
        return _calc_h(self.root)
