class Node_5 {
    int k, depth;
    Node_5 left, right;
    Node_5(int val) {
        k = val;
        depth = 1;
    }
}
public class Tree_5 {
    public static void main(String[] args) {
        Tree_5 t = new Tree_5();
        Node_5 r = t.insert(null, 10);
    }
    public Node_5 insert(Node_5 root, int val) {
        if (root == null) return new Node_5(val);
        if (val < root.k) root.left = insert(root.left, val);
        else if (val > root.k) root.right = insert(root.right, val);
        else return root;

        root.depth = 1 + Math.max(depth(root.left), depth(root.right));
        int diff = bal(root);

        if (diff > 1 && val < root.left.k) return rotCW(root);
        if (diff < -1 && val > root.right.k) return rotCCW(root);
        if (diff > 1 && val > root.left.k) {
            root.left = rotCCW(root.left);
            return rotCW(root);
        }
        if (diff < -1 && val < root.right.k) {
            root.right = rotCW(root.right);
            return rotCCW(root);
        }
        return root;
    }
    public int depth(Node_5 n) {
        return (n == null) ? 0 : n.depth;
    }
    public int bal(Node_5 n) {
        return (n == null) ? 0 : (depth(n.left) - depth(n.right));
    }
    public Node_5 rotCW(Node_5 y) {
        Node_5 x = y.left;
        Node_5 sub = x.right;
        x.right = y;
        y.left = sub;
        y.depth = 1 + Math.max(depth(y.left), depth(y.right));
        x.depth = 1 + Math.max(depth(x.left), depth(x.right));
        return x;
    }
    public Node_5 rotCCW(Node_5 x) {
        Node_5 y = x.right;
        Node_5 sub = y.left;
        y.left = x;
        x.right = sub;
        x.depth = 1 + Math.max(depth(x.left), depth(x.right));
        y.depth = 1 + Math.max(depth(y.left), depth(y.right));
        return y;
    }
}
