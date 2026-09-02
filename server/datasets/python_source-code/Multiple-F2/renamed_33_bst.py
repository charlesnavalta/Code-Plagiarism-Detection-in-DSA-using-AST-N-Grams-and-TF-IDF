"""
Binary Search Tree Suite: Renamed Identifiers
Author: Renamed Variant (Type 2 of Mary)
"""
from typing import Optional, List

class BinaryNode:
    def __init__(self, item: int = 0, l_child: Optional['BinaryNode'] = None, r_child: Optional['BinaryNode'] = None):
        self.item = item
        self.l_child = l_child
        self.r_child = r_child

class TreeManagerEngine:
    def __init__(self):
        self.head_node: Optional[BinaryNode] = None
        self.node_count = 0

    def add_element(self, key: int) -> None:
        def _add_recursive(current: Optional[BinaryNode], key: int) -> BinaryNode:
            if not current:
                self.node_count += 1
                return BinaryNode(key)
            if key < current.item:
                current.l_child = _add_recursive(current.l_child, key)
            elif key > current.item:
                current.r_child = _add_recursive(current.r_child, key)
            return current
        self.head_node = _add_recursive(self.head_node, key)

    def contains_value(self, query: int) -> bool:
        cursor = self.head_node
        while cursor:
            if cursor.item == query:
                return True
            cursor = cursor.l_child if query < cursor.item else cursor.r_child
        return False

    def get_smallest(self) -> Optional[int]:
        if not self.head_node: return None
        cursor = self.head_node
        while cursor.l_child:
            cursor = cursor.l_child
        return cursor.item

    def get_largest(self) -> Optional[int]:
        if not self.head_node: return None
        cursor = self.head_node
        while cursor.r_child:
            cursor = cursor.r_child
        return cursor.item

    def dump_inorder_list(self) -> List[int]:
        accumulator = []
        def _traverse(current: Optional[BinaryNode]):
            if current:
                _traverse(current.l_child)
                accumulator.append(current.item)
                _traverse(current.r_child)
        _traverse(self.head_node)
        return accumulator

    def compute_depth(self) -> int:
        def _depth(current: Optional[BinaryNode]) -> int:
            if not current: return 0
            return 1 + max(_depth(current.l_child), _depth(current.r_child))
        return _depth(self.head_node)
