# Linked List Reversal - DISGUISE: reordered
# Derived from organic_1.py. Same logic and output, but statement/method
# order has been shuffled: methods defined in a different order, and the
# core swap uses simultaneous tuple assignment instead of three separate
# statements (semantically identical, textually reordered).

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def display(self):
        values = []
        current = self.head
        while current:
            values.append(str(current.data))
            current = current.next
        print(" -> ".join(values))

    def reverse(self):
        curr = self.head
        prev = None
        while curr is not None:
            next_node, curr.next, prev = curr.next, prev, curr
            curr = next_node
        self.head = prev

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node


if __name__ == "__main__":
    ll = LinkedList()
    for value in [1, 2, 3, 4, 5]:
        ll.append(value)

    print("Original list:")
    ll.display()

    ll.reverse()

    print("Reversed list:")
    ll.display()
