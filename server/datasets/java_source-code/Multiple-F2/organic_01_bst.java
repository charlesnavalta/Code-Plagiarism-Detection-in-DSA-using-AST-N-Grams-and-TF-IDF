// Binary Search Tree Suite: OOP Tree with Node, Height, and Traversals
// Author: Mary (organic_01_bst.java)
import java.util.ArrayList;
import java.util.List;

public class BinarySearchTreeSuite {
    public static class TreeNode {
        public int val;
        public TreeNode left;
        public TreeNode right;
        public TreeNode(int v) { this.val = v; }
    }

    private TreeNode root;
    private int size;

    public BinarySearchTreeSuite() {
        this.root = null;
        this.size = 0;
    }

    public void insert(int val) {
        this.root = insertRec(this.root, val);
    }

    private TreeNode insertRec(TreeNode node, int val) {
        if (node == null) {
            this.size++;
            return new TreeNode(val);
        }
        if (val < node.val) node.left = insertRec(node.left, val);
        else if (val > node.val) node.right = insertRec(node.right, val);
        return node;
    }

    public boolean search(int target) {
        TreeNode curr = this.root;
        while (curr != null) {
            if (curr.val == target) return true;
            curr = (target < curr.val) ? curr.left : curr.right;
        }
        return false;
    }

    public List<Integer> inorderTraversal() {
        List<Integer> res = new ArrayList<>();
        inorderRec(this.root, res);
        return res;
    }

    private void inorderRec(TreeNode node, List<Integer> res) {
        if (node != null) {
            inorderRec(node.left, res);
            res.add(node.val);
            inorderRec(node.right, res);
        }
    }

    public int getHeight() {
        return heightRec(this.root);
    }

    private int heightRec(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(heightRec(node.left), heightRec(node.right));
    }
}
