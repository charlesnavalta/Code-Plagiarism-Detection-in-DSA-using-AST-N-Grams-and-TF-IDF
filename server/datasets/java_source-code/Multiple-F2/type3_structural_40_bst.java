// Binary Search Tree Suite: Structural Reordering & Iterative Traversal
// Author: Structural Variant (Type 3 of Mary)
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class BinarySearchTreeSuite {
    public static class TreeNode {
        public int val;
        public TreeNode left, right;
        public TreeNode(int v) { this.val = v; }
    }

    private TreeNode root = null;
    private int size = 0;

    public List<Integer> inorderTraversal() {
        List<Integer> list = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = this.root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            list.add(curr.val);
            curr = curr.right;
        }
        return list;
    }

    public boolean search(int target) {
        TreeNode curr = this.root;
        while (curr != null) {
            if (curr.val == target) return true;
            curr = (target < curr.val) ? curr.left : curr.right;
        }
        return false;
    }

    public void insert(int val) {
        if (this.root == null) {
            this.root = new TreeNode(val);
            this.size++;
            return;
        }
        TreeNode curr = this.root;
        while (true) {
            if (val < curr.val) {
                if (curr.left == null) { curr.left = new TreeNode(val); this.size++; break; }
                curr = curr.left;
            } else if (val > curr.val) {
                if (curr.right == null) { curr.right = new TreeNode(val); this.size++; break; }
                curr = curr.right;
            } else break;
        }
    }
}
