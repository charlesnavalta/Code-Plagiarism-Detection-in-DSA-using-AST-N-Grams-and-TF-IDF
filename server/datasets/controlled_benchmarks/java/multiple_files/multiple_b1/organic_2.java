// Binary Tree Traversal - organic submission 2
// In-order traversal using list collector.

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
    public static Node bstInsert(Node root, int value) {
        if (root == null) {
            return new Node(value);
        }
        if (value < root.value) {
            root.left = bstInsert(root.left, value);
        } else {
            root.right = bstInsert(root.right, value);
        }
        return root;
    }

    public static void inorderCollect(Node node, List<Integer> out) {
        if (node != null) {
            inorderCollect(node.left, out);
            out.add(node.value);
            inorderCollect(node.right, out);
        }
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        Node root = null;
        for (int v : values) {
            root = bstInsert(root, v);
        }
        List<Integer> result = new ArrayList<>();
        inorderCollect(root, result);
        System.out.println("In-order (generator): " + result);
    }
}
