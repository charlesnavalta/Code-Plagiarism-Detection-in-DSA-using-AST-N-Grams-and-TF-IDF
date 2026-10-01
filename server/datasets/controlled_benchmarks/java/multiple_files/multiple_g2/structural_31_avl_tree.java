class Node_6 {
    int key, height;
    Node_6 left, right;
    Node_6(int k) {
        key = k;
        height = 1;
    }
}
public class Tree_6 {
    public static void main(String[] args) {
        Tree_6 t = new Tree_6();
        Node_6 root = t.insertKey(null, 10);
    }
    public Node_6 insertKey(Node_6 root, int k) {
        if (root == null) return new Node_6(k);
        if (k < root.key) root.left = insertKey(root.left, k);
        else if (k > root.key) root.right = insertKey(root.right, k);
        else return root;

        root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
        int balance = getBalance(root);

        if (balance > 1 && k < root.left.key) return rotateRight(root);
        if (balance < -1 && k > root.right.key) return rotateLeft(root);
        if (balance > 1 && k > root.left.key) {
            root.left = rotateLeft(root.left);
            return rotateRight(root);
        }
        if (balance < -1 && k < root.right.key) {
            root.right = rotateRight(root.right);
            return rotateLeft(root);
        }
        return root;
    }
    public Node_6 rotateRight(Node_6 y) {
        Node_6 x = y.left;
        Node_6 t2 = x.right;
        x.right = y;
        y.left = t2;
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        return x;
    }
    public Node_6 rotateLeft(Node_6 x) {
        Node_6 y = x.right;
        Node_6 t2 = y.left;
        y.left = x;
        x.right = t2;
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
        y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
        return y;
    }
    public int getHeight(Node_6 node) {
        return (node == null) ? 0 : node.height;
    }
    public int getBalance(Node_6 node) {
        return (node == null) ? 0 : (getHeight(node.left) - getHeight(node.right));
    }
}
