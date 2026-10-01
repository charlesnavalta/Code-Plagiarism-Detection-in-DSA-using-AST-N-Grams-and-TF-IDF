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
    private boolean validFlag;

    public BinarySearchTreeSuite() {
        this.root = null;
        this.size = 0;
        this.validFlag = true;
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
            if (target < curr.val) curr = curr.left;
            else curr = curr.right;
        }
        return false;
    }

    public List<Integer> inorderTraversal() {
        List<Integer> result = new ArrayList<>();
        inorderHelper(this.root, result);
        return result;
    }

    private void inorderHelper(TreeNode ptr, List<Integer> result) {
        if (ptr != null) {
            inorderHelper(ptr.left, result);
            result.add(ptr.val);
            inorderHelper(ptr.right, result);
        }
    }

    public int getHeight() {
        return getTreeDepth(this.root);
    }

    private int getTreeDepth(TreeNode ptr) {
        if (ptr == null) return 0;
        return 1 + Math.max(getTreeDepth(ptr.left), getTreeDepth(ptr.right));
    }
}
