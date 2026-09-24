// Binary Tree Traversal - organic submission 9
// Recursive pre-order via static methods, plus self-test.

import java.util.ArrayList;
import java.util.List;

class Node {
    int key;
    Node left;
    Node right;

    public Node(int key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class TreeOps {
    public static Node insert(Node node, int key) {
        if (node == null) {
            return new Node(key);
        }
        if (key < node.key) {
            node.left = insert(node.left, key);
        } else {
            node.right = insert(node.right, key);
        }
        return node;
    }

    public static List<Integer> preorder(Node node) {
        if (node == null) {
            return new ArrayList<>();
        }
        List<Integer> res = new ArrayList<>();
        res.add(node.key);
        res.addAll(preorder(node.left));
        res.addAll(preorder(node.right));
        return res;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int k : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            root = insert(root, k);
        }
        System.out.println("Pre-order: " + preorder(root));
    }
}
