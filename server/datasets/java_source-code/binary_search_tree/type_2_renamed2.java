class Node {
    int val;
    Node left, right;

    Node(int val) {
        this.val = val;
        left = right = null;
    }
}

class BST {
    Node root;

    public void insertValue(int value) {
        root = insert(root, value);
    }

    private Node insert(Node current, int value) {
        if (current == null) {
            return new Node(value);
        }

        if (value < current.val) {
            current.left = insert(current.left, value);
        } else {
            current.right = insert(current.right, value);
        }

        return current;
    }

    public boolean contains(int value) {
        return search(root, value);
    }

    private boolean search(Node node, int value) {
        if (node == null) return false;

        if (node.val == value) return true;

        if (value < node.val) return search(node.left, value);

        return search(node.right, value);
    }
}