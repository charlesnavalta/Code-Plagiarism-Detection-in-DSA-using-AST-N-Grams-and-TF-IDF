class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def search(self, target):
        current = self.head
        # Standard traversal logic
        while current is not None:
            if current.data == target:
                return True
            current = current.next
        return False

# Execution
ll = LinkedList()
ll.head = Node(10)
print(ll.search(10))