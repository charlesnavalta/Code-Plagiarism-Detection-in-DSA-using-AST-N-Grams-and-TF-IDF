# Linked List Reversal - organic submission 5
# Iterative, but with a length() helper and totally different variable names.

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def push(self, data):
        node = Node(data)
        if self.head is None:
            self.head = node
            return
        tail = self.head
        while tail.next is not None:
            tail = tail.next
        tail.next = node

    def length(self):
        count = 0
        node = self.head
        while node is not None:
            count += 1
            node = node.next
        return count

    def reverse(self):
        node_before = None
        node_at = self.head
        while node_at is not None:
            node_after = node_at.next
            node_at.next = node_before
            node_before = node_at
            node_at = node_after
        self.head = node_before

    def __str__(self):
        vals = []
        node = self.head
        while node is not None:
            vals.append(repr(node.data))
            node = node.next
        return "[" + ", ".join(vals) + "]"


if __name__ == "__main__":
    ll = LinkedList()
    for v in ["a", "b", "c", "d"]:
        ll.push(v)
    print("len:", ll.length())
    print(ll)
    ll.reverse()
    print(ll)
