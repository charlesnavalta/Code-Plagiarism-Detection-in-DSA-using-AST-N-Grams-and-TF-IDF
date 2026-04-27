class Node:
    """Structure for a single tree element."""
    def __init__(self, val):
        self.key = val
        self.left = None
        self.right = None

class BinarySearchTree:
    """
    BST Implementation using encapsulated recursion.
    This approach hides the root handling from the user.
    """
    def __init__(self):
        self.root = None

    # Requirement Part 1: Recursive Insertion (Internal Helper)
    def insert(self, root, key):
        # Even though the prompt asks to pass root, 
        # we fulfill it while keeping the logic unique.
        if not root:
            return Node(key)
        
        if key < root.key:
            root.left = self.insert(root.left, key)
        else:
            root.right = self.insert(root.right, key)
        return root

    # Requirement Part 1: Recursive Search
    def search(self, node, target):
        # Base cases: value found or reached a leaf
        if node is None or node.key == target:
            return node
        
        # Logic: If target is smaller, search left; otherwise, search right
        return self.search(node.left, target) if target < node.key else self.search(node.right, target)

    # Requirement Part 3: In-Order Traversal (Left-Root-Right)
    def inorder_print(self, current_node):
        if current_node:
            self.inorder_print(current_node.left)
            print(f"{current_node.key}", end=" ")
            self.inorder_print(current_node.right)

    # Requirement Part 3: Find Minimum
    def get_min_value(self, current_node):
        # The smallest value is always the 'leftmost' leaf
        if current_node is None:
            return None
        
        while current_node.left:
            current_node = current_node.left
        return current_node.key

# Requirement Part 2: Tree Data & Testing
if __name__ == "__main__":
    my_tree = BinarySearchTree()
    dataset = [50, 30, 70, 20, 40, 60, 80]

    # Data Insertion
    for item in dataset:
        my_tree.root = my_tree.insert(my_tree.root, item)

    # Verification 1: Search for 60
    found_node = my_tree.search(my_tree.root, 60)
    print(f"Found: 60" if found_node else "Not Found: 60")

    # Verification 2: Search for 99
    missing_node = my_tree.search(my_tree.root, 99)
    print(f"Found: 99" if missing_node else "Not Found: 99")

    # Part 3: Extension Results
    print("\nIn-Order Traversal Output:")
    my_tree.inorder_print(my_tree.root)
    
    print(f"\n\nSmallest Value Found: {my_tree.get_min_value(my_tree.root)}")