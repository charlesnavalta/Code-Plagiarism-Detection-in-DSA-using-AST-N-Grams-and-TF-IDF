// Organic BST Student Submission 02
public class AVLBalancedBST {
    public static class AVLNode {
        public int val, height = 1;
        public AVLNode left, right;
        public AVLNode(int v) { this.val = v; }
    }
    private AVLNode root;
    private int height(AVLNode n) { return n == null ? 0 : n.height; }
    public void insert(int val) { root = insert(root, val); }
    private AVLNode insert(AVLNode n, int val) {
        if (n == null) return new AVLNode(val);
        if (val < n.val) n.left = insert(n.left, val);
        else if (val > n.val) n.right = insert(n.right, val);
        n.height = 1 + Math.max(height(n.left), height(n.right));
        return n;
    }
    public boolean search(int val) {
        AVLNode c = root;
        while (c != null) {
            if (c.val == val) return true;
            c = (val < c.val) ? c.left : c.right;
        }
        return false;
    }
}
