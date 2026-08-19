# Linked List Reversal - organic submission 7
# Plain Node objects + a standalone function, no wrapper class at all, with
# a basic assert-based self-test.

class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


def make_chain(values):
    head = tail = None
    for v in values:
        node = Node(v)
        if head is None:
            head = node
        else:
            tail.next = node
        tail = node
    return head


def reverse_chain(head):
    prev = None
    node = head
    while node:
        tmp = node.next
        node.next = prev
        prev = node
        node = tmp
    return prev


def chain_to_list(head):
    out = []
    while head:
        out.append(head.value)
        head = head.next
    return out


def _self_test():
    head = make_chain([1, 2, 3])
    reversed_head = reverse_chain(head)
    assert chain_to_list(reversed_head) == [3, 2, 1]
    print("self-test passed")


if __name__ == "__main__":
    _self_test()
    head = make_chain([9, 7, 5, 3, 1])
    print("before:", chain_to_list(head))
    head = reverse_chain(head)
    print("after: ", chain_to_list(head))
