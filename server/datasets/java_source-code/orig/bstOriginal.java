class Node {
    int key;
    Node left, right;

    public Node(int key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    Node root;

    public Node insert(Node root, int key) {
        if (root == null) {
            return new Node(key);
        }

        if (key < root.key) {
            root.left = insert(root.left, key);
        } else {
            root.right = insert(root.right, key);
        }

        return root;
    }

    public Node search(Node root, int key) {
        if (root == null || root.key == key) {
            return root;
        }

        if (key < root.key) {
            return search(root.left, key);
        }

        return search(root.right, key);
    }
}

public class Main {
    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();

        int[] values = {50, 30, 70, 20, 40, 60, 80};

        for (int v : values) {
            bst.root = bst.insert(bst.root, v);
        }

        Node result = bst.search(bst.root, 60);

        if (result != null) {
            System.out.println("Found");
        } else {
            System.out.println("Not Found");
        }
    }
}