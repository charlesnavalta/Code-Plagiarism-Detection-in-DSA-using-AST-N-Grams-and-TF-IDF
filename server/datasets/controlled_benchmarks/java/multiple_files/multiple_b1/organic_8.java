// Binary Tree Traversal - organic submission 8
// Level-order (breadth-first) traversal using Queue.

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

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

    public static List<Integer> levelOrder(Node root) {
        if (root == null) {
            return new ArrayList<>();
        }
        List<Integer> result = new ArrayList<>();
        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node node = queue.poll();
            result.add(node.data);
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int d : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            root = insert(root, d);
        }
        System.out.println("Level-order (BFS): " + levelOrder(root));
    }
}
