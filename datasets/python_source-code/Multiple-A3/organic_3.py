# Linked List Reversal - organic submission 3
# Class-based, but different naming/API: insert_end, reverse_list, print_list.

class Node:
    def __init__(self, val):
        self.val = val
        self.next_node = None


class SinglyLinkedList:
    def __init__(self):
        self.first = None

    def insert_end(self, val):
        n = Node(val)
        if self.first is None:
            self.first = n
            return
        walker = self.first
        count = 0
        while walker.next_node is not None:
            walker = walker.next_node
            count += 1
        walker.next_node = n

    def reverse_list(self):
        back = None
        here = self.first
        for _ in range(self._length()):
            forward = here.next_node
            here.next_node = back
            back = here
            here = forward
        self.first = back

    def _length(self):
        c = 0
        walker = self.first
        while walker:
            c += 1
            walker = walker.next_node
        return c

    def print_list(self):
        vals = []
        walker = self.first
        while walker:
            vals.append(walker.val)
            walker = walker.next_node
        print(vals)


if __name__ == "__main__":
    sl = SinglyLinkedList()
    for x in (7, 14, 21, 28):
        sl.insert_end(x)
    sl.print_list()
    sl.reverse_list()
    sl.print_list()
