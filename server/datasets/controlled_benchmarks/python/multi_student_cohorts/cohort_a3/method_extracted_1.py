# Linked List Reversal - DISGUISE: method-extracted
# Derived from organic_1.py. The pointer-swap step inside reverse() has been
# pulled out into a separate helper method _swap_pointers, but the overall
# algorithm and output are identical.

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    @staticmethod
    def _swap_pointers(curr, prev):
        next_node = curr.next
        curr.next = prev
        return next_node, curr

    def reverse(self):
        prev = None
        curr = self.head
        while curr is not None:
            next_node, prev = self._swap_pointers(curr, prev)
            curr = next_node
        self.head = prev

    def display(self):
        values = []
        current = self.head
        while current:
            values.append(str(current.data))
            current = current.next
        print(" -> ".join(values))


if __name__ == "__main__":
    ll = LinkedList()
    for value in [1, 2, 3, 4, 5]:
        ll.append(value)

    print("Original list:")
    ll.display()

    ll.reverse()

    print("Reversed list:")
    ll.display()
