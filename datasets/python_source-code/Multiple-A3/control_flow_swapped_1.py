# Linked List Reversal - DISGUISE: control-flow-swapped
# Derived from organic_1.py. The iterative while-loop reversal has been
# rewritten as recursion, but it is the same algorithm producing the same
# output.

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
        self.head = self._reverse_recursive(self.head, None)

    def _reverse_recursive(self, curr, prev):
        if curr is None:
            return prev
        next_node = curr.next
        curr.next = prev
        return self._reverse_recursive(next_node, curr)

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
