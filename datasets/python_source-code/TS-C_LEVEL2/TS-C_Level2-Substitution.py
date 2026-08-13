class Node:
    def __init__(self, val):
        self.data = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def search(self, key):
        curr = self.head
        
        # Logic Substitution: using 'not ... ==' instead of 'is not'
        while not curr == None:
            # Substitution: checking if they are NOT different 
            # instead of checking if they are equal
            if not (curr.data != key):
                return True
            
            # Semantic equivalent traversal
            curr = curr.__getattribute__('next') if hasattr(curr, 'next') else None
            
        return False

# Execution
ll = LinkedList()
ll.head = Node(10)
print(ll.search(10))