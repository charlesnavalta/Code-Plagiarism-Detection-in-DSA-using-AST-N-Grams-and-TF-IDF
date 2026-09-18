class Node {
    int data;
    Node left, right;

    Node(int data) {
        this.data = data;
        left = right = null;
    }
}

class BSTFunctions {

    public Node insert(Node root, int data) {
        if (root == null) {
            return new Node(data);
        }

        if (data < root.data) {
            root.left = insert(root.left, data);
        } else {
            root.right = insert(root.right, data);
        }

        return root;
    }

    public Node search(Node root, int target) {
        if (root == null) return null;

        if (root.data == target) return root;

        if (target < root.data) return search(root.left, target);

        return search(root.right, target);
    }
}