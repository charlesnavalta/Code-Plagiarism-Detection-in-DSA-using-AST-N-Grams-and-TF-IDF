// Binary Tree Traversal - unique source, ITERATIVE family
// This is the second of two "true source" files for this test case.

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

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

    public static List<Integer> inorderIterative(Node root) {
        List<Integer> result = new ArrayList<>();
        Stack<Node> stack = new Stack<>();
        Node current = root;
        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            result.add(current.value);
            current = current.right;
        }
        return result;
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
        List<Integer> result = inorderIterative(root);
        System.out.println("In-order traversal (iterative): " + result);
    }
}
