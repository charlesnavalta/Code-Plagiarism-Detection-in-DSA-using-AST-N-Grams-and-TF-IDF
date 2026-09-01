import java.util.ArrayList;
import java.util.List;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class BST {
    TreeNode root;

    public void insert(int val) {
        root = add(root, val);
    }

    private TreeNode add(TreeNode curr, int v) {
        if (curr == null) return new TreeNode(v);
        if (v < curr.val) curr.left = add(curr.left, v);
        else curr.right = add(curr.right, v);
        return curr;
    }

    public boolean search(int val) {
        TreeNode curr = root;
        while (curr != null) {
            if (curr.val == val) return true;
            curr = (val < curr.val) ? curr.left : curr.right;
        }
        return false;
    }

    public List<Integer> inorder() {
        List<Integer> res = new ArrayList<>();
        traverse(root, res);
        return res;
    }

    private void traverse(TreeNode node, List<Integer> res) {
        if (node != null) {
            traverse(node.left, res);
            res.add(node.val);
            traverse(node.right, res);
        }
    }
}
