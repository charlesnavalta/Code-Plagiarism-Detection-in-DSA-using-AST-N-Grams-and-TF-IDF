public class BinarySearchTree {

    // Replicating the Python Node class
    static class Node {
        int key;
        Node left;
        Node right;

        public Node(int item) {
            key = item;
            left = null;
            right = null;
        }
    }

    Node root;

    // Replicating def __init__(self)
    public BinarySearchTree() {
        root = null;
    }

    public Node insert(Node root, int key) {
        // If the tree is empty, return a new node
        if (root == null) {
            return new Node(key);
        }

        // Otherwise, recur down the tree
        if (key < root.key) {
            root.left = insert(root.left, key);
        } else {
            root.right = insert(root.right, key);
        }

        return root;
    }

    public Node search(Node root, int key) {
        // Base Cases: root is null or key is present at root
        if (root == null || root.key == key) {
            return root;
        }

        // Key is greater than root's key
        if (key < root.key) {
            return search(root.left, key);
        }

        // Key is less than root's key
        return search(root.right, key);
    }

    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();
        int[] values = {50, 30, 70, 20, 40, 60, 80};

        // Replicating the for loop to insert values
        for (int v : values) {
            bst.root = bst.insert(bst.root, v);
        }

        // Search for 60
        Node result = bst.search(bst.root, 60);
        
        // Replicating print("Found" if result else "Not Found")
        System.out.println(result != null ? "Found" : "Not Found");
    }
}