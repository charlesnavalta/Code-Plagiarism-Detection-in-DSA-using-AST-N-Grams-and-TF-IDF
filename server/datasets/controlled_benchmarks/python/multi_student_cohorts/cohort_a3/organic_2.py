# Linked List Reversal - organic submission 2
# Purely functional style, no classes wrapping the list; plain nodes + free functions.

class Node:
    def __init__(self, value, nxt=None):
        self.value = value
        self.nxt = nxt


def from_values(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head


def reverse_list(head):
    previous, current = None, head
    while current:
        current.nxt, previous, current = previous, current, current.nxt
    return previous


def print_list(head):
    out = []
    while head:
        out.append(head.value)
        head = head.nxt
    print(out)


def main():
    head = from_values([5, 10, 15, 20])
    print_list(head)
    head = reverse_list(head)
    print_list(head)


if __name__ == "__main__":
    main()
