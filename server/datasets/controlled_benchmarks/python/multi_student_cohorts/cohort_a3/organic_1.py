# Linked List Reversal - organic submission 1
# Classic iterative reversal using prev/curr/next pointers.

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

    def reverse(self):
        prev = None
        curr = self.head
        while curr is not None:
            next_node = curr.next
            curr.next = prev
            prev = curr
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
