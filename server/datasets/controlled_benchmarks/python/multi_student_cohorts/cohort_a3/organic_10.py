# Linked List Reversal - organic submission 10
# Iterator-protocol based: LinkedList implements __iter__, reversal is a
# module-level function that rebuilds links from a generator.

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        node = Node(data)
        if self.head is None:
            self.head = node
            return
        cur = self.head
        while cur.next is not None:
            cur = cur.next
        cur.next = node

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.data
            cur = cur.next

    def reverse(self):
        self.head = reverse_nodes(self.head)


def reverse_nodes(head):
    stack_of_nodes = []
    node = head
    while node is not None:
        stack_of_nodes.append(node)
        node = node.next
    new_head = None
    prev = None
    while stack_of_nodes:
        top = stack_of_nodes.pop()
        if prev is None:
            new_head = top
        else:
            prev.next = top
        prev = top
    if prev is not None:
        prev.next = None
    return new_head


if __name__ == "__main__":
    ll = LinkedList()
    for v in (1, 2, 3, 4):
        ll.append(v)
    print(list(ll))
    ll.reverse()
    print(list(ll))
