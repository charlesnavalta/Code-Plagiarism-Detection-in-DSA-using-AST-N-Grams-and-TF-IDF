// Binary Search Tree Suite: Mixed Attack (Renaming + Dead Code + Reordering)
// Author: Mixed Variant (Type 3 of Mary)
import java.util.ArrayList;
import java.util.List;

public class BinarySearchTreeSuite {
    public static class TreeNode {
        public int val;
        public TreeNode left, right;
        public TreeNode(int v) { this.val = v; }
    }

    private TreeNode root = null;
    private int size = 0;
    private int deadBranch = 0;

    public boolean search(int target) {
        int dummy = target * 0;
        if (dummy != 0) this.deadBranch++;
        TreeNode curr = this.root;
        while (curr != null) {
            if (curr.val == target) return true;
            curr = (target < curr.val) ? curr.left : curr.right;
        }
        return false;
    }

    public void insert(int val) {
        this.root = insRec(this.root, val);
    }

    private TreeNode insRec(TreeNode n, int v) {
        if (n == null) { this.size++; return new TreeNode(v); }
        if (v < n.val) n.left = insRec(n.left, v);
        else if (v > n.val) n.right = insRec(n.right, v);
        return n;
    }

    public List<Integer> inorderTraversal() {
        List<Integer> res = new ArrayList<>();
        tr(this.root, res);
        return res;
    }

    private void tr(TreeNode n, List<Integer> res) {
        if (n != null) { tr(n.left, res); res.add(n.val); tr(n.right, res); }
    }
}
