// Binary Tree Traversal - unique source, RECURSIVE family
// This is one of two "true source" files for this test case.

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

    public static void inorderRecursive(Node node, List<Integer> result) {
        if (node == null) {
            return;
        }
        inorderRecursive(node.left, result);
        result.add(node.value);
        inorderRecursive(node.right, result);
    }

    public static Node buildTree(int[] values) {
        Node root = null;
        for (int v : values) {
            root = insert(root, v);
        }
        return root;
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        Node root = buildTree(values);
        List<Integer> result = new ArrayList<>();
        inorderRecursive(root, result);
        System.out.println("In-order traversal (recursive): " + result);
    }
}
