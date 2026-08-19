public class BinarySearchTreeOps {

    // Replicating the Python Node class
    static class Node {
        int val;
        Node left;
        Node right;

        public Node(int key) {
            this.val = key;
            this.left = null;
            this.right = null;
        }
    }

    public static Node insert(Node root, int key) {
        if (root == null) {
            return new Node(key);
        } else {
            if (root.val < key) {
                root.right = insert(root.right, key);
            } else {
                root.left = insert(root.left, key);
            }
        }
        return root;
    }

    public static void inorder(Node root) {
        // Python's 'if root:' translates to an explicit null check in Java
        if (root != null) {
            inorder(root.left);
            System.out.println(root.val);
            inorder(root.right);
        }
    }

    public static void main(String[] args) {
        // Execution
        Node r = new Node(50);
        r = insert(r, 30);
        r = insert(r, 70);
        
        inorder(r);
    }
}