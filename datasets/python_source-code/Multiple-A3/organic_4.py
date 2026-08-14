# Linked List Reversal - organic submission 4
# "Convert to array, reverse the array, rebuild the list" approach - genuinely
# different technique from pointer-swapping.

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


def build_linked_list(items):
    dummy = Node(None)
    tail = dummy
    for item in items:
        tail.next = Node(item)
        tail = tail.next
    return dummy.next


def linked_list_to_array(head):
    arr = []
    node = head
    while node is not None:
        arr.append(node.data)
        node = node.next
    return arr


def reverse_via_array(head):
    arr = linked_list_to_array(head)
    arr.reverse()
    return build_linked_list(arr)


def show(head):
    node = head
    parts = []
    while node is not None:
        parts.append(str(node.data))
        node = node.next
    print(", ".join(parts))


if __name__ == "__main__":
    lst = build_linked_list([2, 4, 6, 8, 10])
    show(lst)
    lst = reverse_via_array(lst)
    show(lst)
