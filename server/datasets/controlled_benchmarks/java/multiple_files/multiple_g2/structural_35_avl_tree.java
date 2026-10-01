class Node_10 {
    int key, height;
    Node_10 left, right;
    Node_10(int k) {
        key = k;
        height = 1;
    }
}
public class Tree_10 {
    public static void main(String[] args) {
        Tree_10 t = new Tree_10();
        Node_10 r = t.insert(null, 10);
    }
    public Node_10 doubleLR(Node_10 node) {
        node.left = singleLeft(node.left);
        return singleRight(node);
    }
    public Node_10 doubleRL(Node_10 node) {
        node.right = singleRight(node.right);
        return singleLeft(node);
    }
    public Node_10 insert(Node_10 root, int key) {
        if (root == null) return new Node_10(key);
        if (key < root.key) root.left = insert(root.left, key);
        else if (key > root.key) root.right = insert(root.right, key);
        else return root;

        root.height = 1 + Math.max(h(root.left), h(root.right));
        int bf = b(root);

        if (bf > 1 && key < root.left.key) return singleRight(root);
        if (bf < -1 && key > root.right.key) return singleLeft(root);
        if (bf > 1 && key > root.left.key) return doubleLR(root);
        if (bf < -1 && key < root.right.key) return doubleRL(root);
        return root;
    }
    public Node_10 singleRight(Node_10 y) {
        Node_10 x = y.left;
        Node_10 t = x.right;
        x.right = y;
        y.left = t;
        y.height = 1 + Math.max(h(y.left), h(y.right));
        x.height = 1 + Math.max(h(x.left), h(x.right));
        return x;
    }
    public Node_10 singleLeft(Node_10 x) {
        Node_10 y = x.right;
        Node_10 t = y.left;
        y.left = x;
        x.right = t;
        x.height = 1 + Math.max(h(x.left), h(x.right));
        y.height = 1 + Math.max(h(y.left), h(y.right));
        return y;
    }
    public int h(Node_10 n) {
        return (n == null) ? 0 : n.height;
    }
    public int b(Node_10 n) {
        return (n == null) ? 0 : (h(n.left) - h(n.right));
    }
}
