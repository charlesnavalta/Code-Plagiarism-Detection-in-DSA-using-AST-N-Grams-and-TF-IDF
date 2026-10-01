class Node_3 {
    int key, height;
    Node_3 left, right;
    Node_3(int k) {
        key = k;
        height = 1;
    }
}
public class Tree_3 {
    public static void main(String[] args) {
        Tree_3 t = new Tree_3();
        Node_3 root = t.insert(null, 10);
    }
    public Node_3 doubleRotateLR(Node_3 root) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }
    public Node_3 doubleRotateRL(Node_3 root) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }
    public Node_3 insert(Node_3 node, int key) {
        if (node == null) return new Node_3(key);
        if (key < node.key) node.left = insert(node.left, key);
        else if (key > node.key) node.right = insert(node.right, key);
        else return node;

        node.height = 1 + Math.max(height(node.left), height(node.right));
        int b = getBalance(node);

        if (b > 1 && key < node.left.key) return rightRotate(node);
        if (b < -1 && key > node.right.key) return leftRotate(node);
        if (b > 1 && key > node.left.key) return doubleRotateLR(node);
        if (b < -1 && key < node.right.key) return doubleRotateRL(node);
        return node;
    }
    public Node_3 rightRotate(Node_3 y) {
        Node_3 x = y.left;
        Node_3 sub = x.right;
        x.right = y;
        y.left = sub;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }
    public Node_3 leftRotate(Node_3 x) {
        Node_3 y = x.right;
        Node_3 sub = y.left;
        y.left = x;
        x.right = sub;
        x.height = 1 + Math.max(height(x.left), height(x.right));
        y.height = 1 + Math.max(height(y.left), height(y.right));
        return y;
    }
    public int height(Node_3 n) {
        return (n == null) ? 0 : n.height;
    }
    public int getBalance(Node_3 n) {
        return (n == null) ? 0 : (height(n.left) - height(n.right));
    }
}
