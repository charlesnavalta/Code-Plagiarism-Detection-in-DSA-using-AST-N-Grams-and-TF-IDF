// Organic BST Student Submission 18
public class ParentLinkedBST {
    public static class Node {
        public int key;
        public Node left, right, parent;
        public Node(int k, Node p) { this.key = k; this.parent = p; }
    }
    private Node root = null;
    public void insert(int k) {
        if (root == null) { root = new Node(k, null); return; }
        Node curr = root;
        while (true) {
            if (k < curr.key) {
                if (curr.left == null) { curr.left = new Node(k, curr); break; }
                curr = curr.left;
            } else if (k > curr.key) {
                if (curr.right == null) { curr.right = new Node(k, curr); break; }
                curr = curr.right;
            } else break;
        }
    }
}
