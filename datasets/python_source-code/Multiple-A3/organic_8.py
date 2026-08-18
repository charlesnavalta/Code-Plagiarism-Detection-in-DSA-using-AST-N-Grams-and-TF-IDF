# Linked List Reversal - organic submission 8
# Class-based with __repr__, and reversal done with a manual index-based
# while loop plus an explicit swap-count print for debugging flavor.

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

    def __repr__(self):
        return f"Node({self.data!r})"


class LinkedList:
    def __init__(self, items=None):
        self.head = None
        if items:
            for i in items:
                self.append(i)

    def append(self, data):
        n = Node(data)
        if not self.head:
            self.head = n
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = n

    def reverse(self):
        prev_node = None
        cur_node = self.head
        swaps = 0
        while cur_node:
            nxt_node = cur_node.next
            cur_node.next = prev_node
            prev_node = cur_node
            cur_node = nxt_node
            swaps += 1
        self.head = prev_node
        print(f"performed {swaps} pointer swaps")

    def as_list(self):
        result = []
        cur = self.head
        while cur:
            result.append(cur.data)
            cur = cur.next
        return result


if __name__ == "__main__":
    ll = LinkedList([11, 22, 33, 44, 55])
    print(ll.as_list())
    ll.reverse()
    print(ll.as_list())
