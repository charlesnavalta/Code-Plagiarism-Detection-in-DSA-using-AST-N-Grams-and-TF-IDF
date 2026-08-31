import java.util.ArrayList;
import java.util.List;

class CustomNode_20 {
    int item_val;
    CustomNode_20 left;
    CustomNode_20 right;
    CustomNode_20(int item_val) { this.item_val = item_val; }
}

public class BST {
    CustomNode_20 root;
    // Standard iterative/recursive BST
public void insert(int val) {
        if (root == null) {
            root = new CustomNode_20(val);
            return;
        }
        CustomNode_20 curr = root;
        while (true) {
            if (val < curr.item_val) {
                if (curr.left == null) {
                    curr.left = new CustomNode_20(val);
                    break;
                }
                curr = curr.left;
            } else {
                if (curr.right == null) {
                    curr.right = new CustomNode_20(val);
                    break;
                }
                curr = curr.right;
            }
        }
    }

    public boolean search(int val) {
        CustomNode_20 curr = root;
        while (curr != null) {
            if (curr.item_val == val) return true;
            curr = (val < curr.item_val) ? curr.left : curr.right;
        }
        return false;
    }

    public List<Integer> inorder() {
        List<Integer> res = new ArrayList<>();
        traverse(root, res);
        return res;
    }

    private void traverse(CustomNode_20 node, List<Integer> res) {
        if (node != null) {
            traverse(node.left, res);
            res.add(node.item_val);
            traverse(node.right, res);
        }
    }
}
