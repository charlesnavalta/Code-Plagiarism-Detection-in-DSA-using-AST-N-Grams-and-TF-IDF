# Linked List Reversal - organic submission 6
# Recursive reversal, module-level helper (not a method), with type hints.

from __future__ import annotations
from typing import Optional


class Node:
    def __init__(self, data: int, nxt: "Optional[Node]" = None):
        self.data = data
        self.next = nxt


class LinkedList:
    def __init__(self):
        self.head: Optional[Node] = None
        self.tail: Optional[Node] = None

    def add(self, data: int) -> None:
        node = Node(data)
        if self.head is None:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node

    def reverse(self) -> None:
        self.head = _recursive_reverse(self.head)
        # tail bookkeeping is no longer meaningful after reversal
        self.tail = None

    def to_list(self):
        out = []
        node = self.head
        while node:
            out.append(node.data)
            node = node.next
        return out


def _recursive_reverse(node: "Optional[Node]", carried=None):
    if node is None:
        return carried
    following = node.next
    node.next = carried
    return _recursive_reverse(following, node)


if __name__ == "__main__":
    ll = LinkedList()
    for n in (100, 200, 300):
        ll.add(n)
    print(ll.to_list())
    ll.reverse()
    print(ll.to_list())
