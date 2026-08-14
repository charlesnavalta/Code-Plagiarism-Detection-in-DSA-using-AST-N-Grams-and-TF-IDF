public class BinarySearchTreeReformat {

    // Replicating the Node class
    static class Node {
        int key;
        Node left;
        Node right;

        public Node(int key) {
            this.key = key; 
            this.left = null; 
            this.right = null;
        }
    }

    Node root;

    public BinarySearchTreeReformat() { 
        this.root = null; 
    }

    public Node insert(Node root, int key) {
        if (root == null) return new Node(key);

        if (key < root.key) root.left = insert(root.left, key);
        else root.right = insert(root.right, key);
        
        return root;
    }

    public Node search(Node root, int key) {
        if (root == null || root.key == key) return root;

        if (key < root.key) {
            return search(root.left, key);
        }

        return search(root.right, key);
    }

    public static void main(String[] args) {
        BinarySearchTreeReformat bst = new BinarySearchTreeReformat(); 
        int[] values = {50, 30, 70, 20, 40, 60, 80};

        for (int v : values) bst.root = bst.insert(bst.root, v);
        
        Node result = bst.search(bst.root, 60); 
        System.out.println(result != null ? "Found" : "Not Found");
    }
}