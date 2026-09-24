// =============================================================================
// IT EXPERT EVALUATION - ERROR HANDLING DEMONSTRATION: CASE 8 (Positive Control)
// Scenario: Valid Java Binary Search Tree Implementation
// Target: Demonstrates successful, error-free parsing and Java AST tree extraction.
// =============================================================================

public class BinarySearchTree {
    static class Node {
        int key;
        Node left, right;
        public Node(int item) {
            this.key = item;
            this.left = null;
            this.right = null;
        }
    }

    private Node root;

    public void insert(int key) {
        root = insertRec(root, key);
    }

    private Node insertRec(Node current, int key) {
        if (current == null) {
            return new Node(key);
        }
        if (key < current.key) {
            current.left = insertRec(current.left, key);
        } else if (key > current.key) {
            current.right = insertRec(current.right, key);
        }
        return current;
    }
}
