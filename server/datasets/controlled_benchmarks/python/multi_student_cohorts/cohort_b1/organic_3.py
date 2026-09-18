# Binary Tree Traversal - organic submission 3
# Recursive post-order using dataclass-based nodes and type hints.

from dataclasses import dataclass
from typing import Optional, List


@dataclass
class TreeNode:
    key: int
    left: "Optional[TreeNode]" = None
    right: "Optional[TreeNode]" = None


def insert(root: "Optional[TreeNode]", key: int) -> "TreeNode":
    if root is None:
        return TreeNode(key)
    if key < root.key:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root


def postorder(node: "Optional[TreeNode]", acc: List[int]) -> None:
    if node is None:
        return
    postorder(node.left, acc)
    postorder(node.right, acc)
    acc.append(node.key)


if __name__ == "__main__":
    keys = [50, 30, 70, 20, 40, 60, 80]
    root = None
    for k in keys:
        root = insert(root, k)
    acc: List[int] = []
    postorder(root, acc)
    print("Post-order:", acc)
