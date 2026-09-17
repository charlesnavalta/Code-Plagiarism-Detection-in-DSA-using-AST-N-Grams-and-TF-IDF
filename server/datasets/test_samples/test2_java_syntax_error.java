// =============================================================================
// TEST CASE 2: Java Syntax Error (Deliberate unclosed method signature)
// IT Expert Survey Section 2.A - Question 2 Demonstration
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
