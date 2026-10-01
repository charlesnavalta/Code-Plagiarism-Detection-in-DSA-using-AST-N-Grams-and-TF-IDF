class Node_0 {
    int key, height;
    Node_0 left, right;
    Node_0(int val) {
        key = val;
        height = 1;
    }
}
public class Tree_0 {
    public static void main(String[] args) {
        Tree_0 t = new Tree_0();
        Node_0 r = null;
        r = t.insert(r, 10);
    }
    public Node_0 insert(Node_0 node, int val) {
        if (node == null) return new Node_0(val);
        if (val < node.key) node.left = insert(node.left, val);
        else if (val > node.key) node.right = insert(node.right, val);
        else return node;

        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
        int diff = getBal(node);

        if (diff < -1 && val > node.right.key) return rotLeft(node);
        if (diff > 1 && val < node.left.key) return rotRight(node);
        if (diff < -1 && val < node.right.key) {
            node.right = rotRight(node.right);
            return rotLeft(node);
        }
        if (diff > 1 && val > node.left.key) {
            node.left = rotLeft(node.left);
            return rotRight(node);
        }
        return node;
    }
    public Node_0 rotLeft(Node_0 x) {
        Node_0 y = x.right;
        Node_0 sub = y.left;
        y.left = x;
        x.right = sub;
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
        return y;
    }
    public Node_0 rotRight(Node_0 y) {
        Node_0 x = y.left;
        Node_0 sub = x.right;
        x.right = y;
        y.left = sub;
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
        return x;
    }
    public int getHeight(Node_0 n) {
        return (n == null) ? 0 : n.height;
    }
    public int getBal(Node_0 n) {
        return (n == null) ? 0 : (getHeight(n.left) - getHeight(n.right));
    }
}
