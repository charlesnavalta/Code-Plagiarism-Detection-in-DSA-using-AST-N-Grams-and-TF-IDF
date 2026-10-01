import java.util.ArrayList;
import java.util.List;

public class BinarySearchTreeSuite {
    public static class NodeItem {
        public int key;
        public NodeItem left;
        public NodeItem right;
        public NodeItem(int k) { this.key = k; }
    }

    private NodeItem root;
    private int count;

    public BinarySearchTreeSuite() {
        this.root = null;
        this.count = 0;
    }

    public void insert(int val) {
        this.root = addRec(this.root, val);
    }

    private NodeItem addRec(NodeItem node, int val) {
        if (node == null) {
            this.count++;
            return new NodeItem(val);
        }
        if (val < node.key) node.left = addRec(node.left, val);
        else if (val > node.key) node.right = addRec(node.right, val);
        return node;
    }

    public boolean search(int target) {
        NodeItem curr = this.root;
        while (curr != null) {
            if (curr.key == target) return true;
            curr = (target < curr.key) ? curr.left : curr.right;
        }
        return false;
    }

    public List<Integer> inorderTraversal() {
        List<Integer> res = new ArrayList<>();
        traverse(this.root, res);
        return res;
    }

    private void traverse(NodeItem node, List<Integer> res) {
        if (node != null) {
            traverse(node.left, res);
            res.add(node.key);
            traverse(node.right, res);
        }
    }

    public int getHeight() {
        return depth(this.root);
    }

    private int depth(NodeItem node) {
        if (node == null) return 0;
        return 1 + Math.max(depth(node.left), depth(node.right));
    }
}
