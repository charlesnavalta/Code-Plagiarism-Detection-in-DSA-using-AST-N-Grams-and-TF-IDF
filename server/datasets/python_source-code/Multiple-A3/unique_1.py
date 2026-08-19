# Linked List Reversal - "unique" outlier submission
# Deliberately different paradigm from every organic file: dataclass-based
# nodes, type-hinted free functions, stack-based rebuild. Should NOT be
# flagged as matching any other file in this set.

from dataclasses import dataclass
from typing import Optional, List


@dataclass
class ListNode:
    value: int
    next: Optional["ListNode"] = None


def build_list(values: List[int]) -> Optional[ListNode]:
    head: Optional[ListNode] = None
    tail: Optional[ListNode] = None
    for v in values:
        node = ListNode(v)
        if head is None:
            head = tail = node
        else:
            tail.next = node
            tail = node
    return head


def reverse_with_stack(head: Optional[ListNode]) -> Optional[ListNode]:
    stack = []
    node = head
    while node:
        stack.append(node)
        node = node.next

    if not stack:
        return None

    new_head = stack.pop()
    current = new_head
    while stack:
        current.next = stack.pop()
        current = current.next
    current.next = None
    return new_head


def to_string(head: Optional[ListNode]) -> str:
    parts = []
    node = head
    while node:
        parts.append(str(node.value))
        node = node.next
    return " -> ".join(parts)


def main():
    numbers = [10, 20, 30, 40, 50]
    head = build_list(numbers)
    print(f"Before: {to_string(head)}")
    reversed_head = reverse_with_stack(head)
    print(f"After:  {to_string(reversed_head)}")


if __name__ == "__main__":
    main()
