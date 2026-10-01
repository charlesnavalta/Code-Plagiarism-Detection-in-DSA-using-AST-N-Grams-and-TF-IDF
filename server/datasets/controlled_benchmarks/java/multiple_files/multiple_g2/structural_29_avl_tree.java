class Node_4 {
    int key, height;
    Node_4 left, right;
    Node_4(int d) {
        key = d;
        height = 1;
    }
}
public class Tree_4 {
    public static void main(String[] args) {
        Tree_4 t = new Tree_4();
        Node_4 r = t.insert(null, 10);
    }
    public Node_4 rightRotate(Node_4 y) {
        Node_4 x = y.left;
        Node_4 t2 = x.right;
        x.right = y;
        y.left = t2;
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
        return x;
    }
    public Node_4 leftRotate(Node_4 x) {
        Node_4 y = x.right;
        Node_4 t2 = y.left;
        y.left = x;
        x.right = t2;
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
        return y;
    }
    public int getHeight(Node_4 n) {
        return (n == null) ? 0 : n.height;
    }
    public int getBalance(Node_4 n) {
        return (n == null) ? 0 : (getHeight(n.left) - getHeight(n.right));
    }
    public Node_4 insert(Node_4 root, int item) {
        if (root == null) return new Node_4(item);
        if (item < root.key) root.left = insert(root.left, item);
        else if (item > root.key) root.right = insert(root.right, item);
        else return root;

        root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
        int bal = getBalance(root);

        if (bal > 1 && item < root.left.key) return rightRotate(root);
        if (bal < -1 && item > root.right.key) return leftRotate(root);
        if (bal > 1 && item > root.left.key) {
            root.left = leftRotate(root.left);
            return rightRotate(root);
        }
        if (bal < -1 && item < root.right.key) {
            root.right = rightRotate(root.right);
            return leftRotate(root);
        }
        return root;
    }
}
