class Node_2 {
    int val, ht;
    Node_2 left, right;
    Node_2(int v) {
        val = v;
        ht = 1;
    }
}
public class Tree_2 {
    public static void main(String[] args) {
        Tree_2 t = new Tree_2();
        Node_2 r = t.insertVal(null, 10);
    }
    public Node_2 insertVal(Node_2 node, int v) {
        if (node == null) return new Node_2(v);
        if (v < node.val) node.left = insertVal(node.left, v);
        else if (v > node.val) node.right = insertVal(node.right, v);
        else return node;

        node.ht = 1 + Math.max(hVal(node.left), hVal(node.right));
        int diff = calcDiff(node);

        if (diff < -1 && v < node.left.val) return rRot(node);
        if (diff > 1 && v > node.right.val) return lRot(node);
        if (diff < -1 && v > node.left.val) {
            node.left = lRot(node.left);
            return rRot(node);
        }
        if (diff > 1 && v < node.right.val) {
            node.right = rRot(node.right);
            return lRot(node);
        }
        return node;
    }
    public int calcDiff(Node_2 n) {
        if (n == null) return 0;
        return hVal(n.right) - hVal(n.left);
    }
    public int hVal(Node_2 n) {
        return (n == null) ? 0 : n.ht;
    }
    public Node_2 rRot(Node_2 y) {
        Node_2 x = y.left;
        Node_2 sub = x.right;
        x.right = y;
        y.left = sub;
        y.ht = 1 + Math.max(hVal(y.left), hVal(y.right));
        x.ht = 1 + Math.max(hVal(x.left), hVal(x.right));
        return x;
    }
    public Node_2 lRot(Node_2 x) {
        Node_2 y = x.right;
        Node_2 sub = y.left;
        y.left = x;
        x.right = sub;
        x.ht = 1 + Math.max(hVal(x.left), hVal(x.right));
        y.ht = 1 + Math.max(hVal(y.left), hVal(y.right));
        return y;
    }
}
