// Binary Tree Traversal - organic submission 3
// Recursive post-order with explicit TreeNode and accumulator.

import java.util.ArrayList;
import java.util.List;

class TreeNode {
    int key;
    TreeNode left;
    TreeNode right;

    public TreeNode(int key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class Solution {
    public static TreeNode insert(TreeNode root, int key) {
        if (root == null) {
            return new TreeNode(key);
        }
        if (key < root.key) {
            root.left = insert(root.left, key);
        } else {
            root.right = insert(root.right, key);
        }
        return root;
    }

    public static void postorder(TreeNode node, List<Integer> acc) {
        if (node == null) {
            return;
        }
        postorder(node.left, acc);
        postorder(node.right, acc);
        acc.add(node.key);
    }

    public static void main(String[] args) {
        int[] keys = {50, 30, 70, 20, 40, 60, 80};
        TreeNode root = null;
        for (int k : keys) {
            root = insert(root, k);
        }
        List<Integer> acc = new ArrayList<>();
        postorder(root, acc);
        System.out.println("Post-order: " + acc);
    }
}
