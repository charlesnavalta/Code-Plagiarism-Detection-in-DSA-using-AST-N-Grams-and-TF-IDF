import java.util.ArrayList;
import java.util.List;

class CustomNode_26 {
    int item_val;
    CustomNode_26 left;
    CustomNode_26 right;
    CustomNode_26(int item_val) { this.item_val = item_val; }
}

public class BST {
    CustomNode_26 root;
    // Standard iterative/recursive BST
public void insert(int val) {
        if (root == null) {
            root = new CustomNode_26(val);
            return;
        }
        CustomNode_26 curr = root;
        while (true) {
            if (val < curr.item_val) {
                if (curr.left == null) {
                    curr.left = new CustomNode_26(val);
                    break;
                }
                curr = curr.left;
            } else {
                if (curr.right == null) {
                    curr.right = new CustomNode_26(val);
                    break;
                }
                curr = curr.right;
            }
        }
    }

    public boolean search(int val) {
        CustomNode_26 curr = root;
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

    private void traverse(CustomNode_26 node, List<Integer> res) {
        if (node != null) {
            traverse(node.left, res);
            res.add(node.item_val);
            traverse(node.right, res);
        }
    }
}
