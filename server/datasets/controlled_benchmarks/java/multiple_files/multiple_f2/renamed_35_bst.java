// Binary Search Tree Suite: Renamed Identifiers
// Author: Renamed Variant (Type 2 of Mary)
import java.util.ArrayList;
import java.util.List;

public class BinaryTreeManager {
    public static class NodeElement {
        public int itemKey;
        public NodeElement lChild;
        public NodeElement rChild;
        public NodeElement(int key) { this.itemKey = key; }
    }

    private NodeElement headNode;
    private int totalNodes;

    public BinaryTreeManager() {
        this.headNode = null;
        this.totalNodes = 0;
    }

    public void addKey(int key) {
        this.headNode = addKeyRecursive(this.headNode, key);
    }

    private NodeElement addKeyRecursive(NodeElement current, int key) {
        if (current == null) {
            this.totalNodes++;
            return new NodeElement(key);
        }
        if (key < current.itemKey) current.lChild = addKeyRecursive(current.lChild, key);
        else if (key > current.itemKey) current.rChild = addKeyRecursive(current.rChild, key);
        return current;
    }

    public boolean containsItem(int query) {
        NodeElement cursor = this.headNode;
        while (cursor != null) {
            if (cursor.itemKey == query) return true;
            cursor = (query < cursor.itemKey) ? cursor.lChild : cursor.rChild;
        }
        return false;
    }

    public List<Integer> dumpInOrder() {
        List<Integer> outList = new ArrayList<>();
        traverseInOrder(this.headNode, outList);
        return outList;
    }

    private void traverseInOrder(NodeElement current, List<Integer> outList) {
        if (current != null) {
            traverseInOrder(current.lChild, outList);
            outList.add(current.itemKey);
            traverseInOrder(current.rChild, outList);
        }
    }

    public int computeDepth() {
        return depthRecursive(this.headNode);
    }

    private int depthRecursive(NodeElement current) {
        if (current == null) return 0;
        return 1 + Math.max(depthRecursive(current.lChild), depthRecursive(current.rChild));
    }
}
