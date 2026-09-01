import java.util.ArrayList;
import java.util.List;

class DictNode_3 {
    int keyVal;
    DictNode_3 leftChild, rightChild;
    DictNode_3(int k) { this.keyVal = k; }
}

public class BST {
    public DictNode_3 putTreeItem(DictNode_3 node, int val) {
        if (node == null) return new DictNode_3(val);
        if (val < node.keyVal) node.leftChild = putTreeItem(node.leftChild, val);
        else node.rightChild = putTreeItem(node.rightChild, val);
        return node;
    }

    public boolean hasTreeItem(DictNode_3 node, int val) {
        if (node == null) return false;
        if (node.keyVal == val) return true;
        return (val < node.keyVal) ? hasTreeItem(node.leftChild, val) : hasTreeItem(node.rightChild, val);
    }

    public List<Integer> dumpSorted(DictNode_3 node) {
        List<Integer> res = new ArrayList<>();
        if (node != null) {
            res.addAll(dumpSorted(node.leftChild));
            res.add(node.keyVal);
            res.addAll(dumpSorted(node.rightChild));
        }
        return res;
    }
}
