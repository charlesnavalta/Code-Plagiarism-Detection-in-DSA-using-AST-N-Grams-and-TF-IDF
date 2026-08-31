// Binary Tree Traversal - organic submission 10
// Iterative in-order using explicit while-true and stack.

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
    public static Node insert(Node root, int val) {
        if (root == null) {
            return new Node(val);
        }
        if (val < root.value) {
            root.left = insert(root.left, val);
        } else {
            root.right = insert(root.right, val);
        }
        return root;
    }

    public static List<Integer> inorderIterative(Node root) {
        List<Integer> res = new ArrayList<>();
        Stack<Node> s = new Stack<>();
        Node curr = root;
        while (true) {
            if (curr != null) {
                s.push(curr);
                curr = curr.left;
            } else if (!s.isEmpty()) {
                curr = s.pop();
                res.add(curr.value);
                curr = curr.right;
            } else {
                break;
            }
        }
        return res;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            root = insert(root, v);
        }
        System.out.println("In-order (iterative loop): " + inorderIterative(root));
    }
}
