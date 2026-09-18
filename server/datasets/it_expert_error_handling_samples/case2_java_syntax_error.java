// =============================================================================
// IT EXPERT EVALUATION - ERROR HANDLING DEMONSTRATION: CASE 2
// Scenario: Java Syntax Error (Unclosed method parameter signature)
// Target: Demonstrates system fault tolerance and graceful error handling on invalid Java code.
// =============================================================================

public class BinarySearchTree {
    static class Node {
        int key;
        Node left, right;
        public Node(int item) { key = item; }
    }

    // INTENTIONAL SYNTAX ERROR ON LINE 14 (Missing closing parameter parenthesis):
    public Node insert(Node root, int key {
        if (root == null) {
            root = new Node(key);
            return root;
        }
        return root;
    }
}
