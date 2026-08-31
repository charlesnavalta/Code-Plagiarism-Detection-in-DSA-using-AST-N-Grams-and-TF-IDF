// Binary Tree Traversal - organic submission 6
// Recursive in-order building the result by list concatenation.

import java.util.ArrayList;
import java.util.List;

class Node {
    int value;
    Node left;
    Node right;

    public Node(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Solution {
    public static Node insert(Node root, int value) {
        if (root == null) {
            return new Node(value);
        }
        if (value < root.value) {
            root.left = insert(root.left, value);
        } else {
            root.right = insert(root.right, value);
        }
        return root;
    }

    public static List<Integer> inorder(Node node) {
        if (node == null) {
            return new ArrayList<>();
        }
        List<Integer> res = new ArrayList<>();
        res.addAll(inorder(node.left));
        res.add(node.value);
        res.addAll(inorder(node.right));
        return res;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            root = insert(root, v);
        }
        System.out.println("In-order (list concatenation): " + inorder(root));
    }
}
