# Linked List Reversal - organic submission 9
# Adds insert_at_head alongside append, and reverses using enumerate-style
# manual walking with a while-True/break structure.

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        n = Node(data)
        n.next = self.head
        self.head = n

    def append(self, data):
        n = Node(data)
        if self.head is None:
            self.head = n
            return
        walker = self.head
        while True:
            if walker.next is None:
                break
            walker = walker.next
        walker.next = n

    def reverse(self):
        previous = None
        current = self.head
        while True:
            if current is None:
                break
            nxt = current.next
            current.next = previous
            previous = current
            current = nxt
        self.head = previous

    def values(self):
        out = []
        walker = self.head
        while walker is not None:
            out.append(walker.data)
            walker = walker.next
        return out


if __name__ == "__main__":
    ll = LinkedList()
    for v in [3, 1, 4, 1, 5, 9]:
        ll.append(v)
    ll.insert_at_head(0)
    print(ll.values())
    ll.reverse()
    print(ll.values())
