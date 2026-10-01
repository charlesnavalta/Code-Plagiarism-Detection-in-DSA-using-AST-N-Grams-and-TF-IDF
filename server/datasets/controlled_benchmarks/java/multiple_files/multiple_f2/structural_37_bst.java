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
        this.root = addNode(this.root, val);
    }

    private TreeNode addNode(TreeNode node, int val) {
        if (node == null) {
            this.size++;
            return new TreeNode(val);
        }
        if (val < node.val) node.left = addNode(node.left, val);
        else if (val > node.val) node.right = addNode(node.right, val);
        return node;
    }

    public boolean search(int target) {
        TreeNode curr = this.root;
        while (curr != null) {
            if (curr.val == target) return true;
            if (target < curr.val) curr = curr.left;
            else curr = curr.right;
        }
        return false;
    }

    public List<Integer> inorderTraversal() {
        List<Integer> list = new ArrayList<>();
        walkInorder(this.root, list);
        return list;
    }

    private void walkInorder(TreeNode node, List<Integer> list) {
        if (node != null) {
            walkInorder(node.left, list);
            list.add(node.val);
            walkInorder(node.right, list);
        }
    }

    public int getHeight() {
        return computeHeight(this.root);
    }

    private int computeHeight(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(computeHeight(node.left), computeHeight(node.right));
    }
}
