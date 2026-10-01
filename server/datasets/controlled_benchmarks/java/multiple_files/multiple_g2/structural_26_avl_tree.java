class Node_1 {
    int key, h;
    Node_1 left, right;
    Node_1(int v) {
        key = v;
        h = 1;
    }
}
public class Tree_1 {
    public static void main(String[] args) {
        Tree_1 t = new Tree_1();
        Node_1 root = t.add(null, 10);
    }
    public Node_1 add(Node_1 node, int k) {
        if (node == null) return new Node_1(k);
        if (k < node.key) node.left = add(node.left, k);
        else if (k > node.key) node.right = add(node.right, k);
        else return node;

        node.h = 1 + Math.max(getH(node.left), getH(node.right));
        int b = getBalanceFactor(node);

        if (b > 1) {
            if (k < node.left.key) return rotateRight(node);
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        if (b < -1) {
            if (k > node.right.key) return rotateLeft(node);
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    }
    public int getH(Node_1 n) {
        return (n == null) ? 0 : n.h;
    }
    public int getBalanceFactor(Node_1 n) {
        return (n == null) ? 0 : (getH(n.left) - getH(n.right));
    }
    public Node_1 rotateRight(Node_1 y) {
        Node_1 x = y.left;
        Node_1 t2 = x.right;
        x.right = y;
        y.left = t2;
        y.h = Math.max(getH(y.left), getH(y.right)) + 1;
        x.h = Math.max(getH(x.left), getH(x.right)) + 1;
        return x;
    }
    public Node_1 rotateLeft(Node_1 x) {
        Node_1 y = x.right;
        Node_1 t2 = y.left;
        y.left = x;
        x.right = t2;
        x.h = Math.max(getH(x.left), getH(x.right)) + 1;
        y.h = Math.max(getH(y.left), getH(y.right)) + 1;
        return y;
    }
}
