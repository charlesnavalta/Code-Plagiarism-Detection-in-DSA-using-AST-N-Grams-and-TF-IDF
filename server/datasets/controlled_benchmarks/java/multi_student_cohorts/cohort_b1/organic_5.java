// Binary Tree Traversal - organic submission 5
// Iterative post-order using the two-stacks technique.

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Stack;

class Node {
    int data;
    Node left;
    Node right;

    public Node(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Solution {
    public static Node insert(Node root, int data) {
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

    public static List<Integer> postorderTwoStacks(Node root) {
        if (root == null) {
            return new ArrayList<>();
        }
        Stack<Node> stack1 = new Stack<>();
        List<Integer> stack2 = new ArrayList<>();
        stack1.push(root);
        while (!stack1.isEmpty()) {
            Node node = stack1.pop();
            stack2.add(node.data);
            if (node.left != null) {
                stack1.push(node.left);
            }
            if (node.right != null) {
                stack1.push(node.right);
            }
        }
        Collections.reverse(stack2);
        return stack2;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int d : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            root = insert(root, d);
        }
        System.out.println("Post-order (two stacks): " + postorderTwoStacks(root));
    }
}
