class Node_9 {
    int key, height;
    Node_9 left, right;
    Node_9(int k) {
        key = k;
        height = 1;
    }
}
public class Tree_9 {
    public static void main(String[] args) {
        Tree_9 t = new Tree_9();
        Node_9 r = t.insert(null, 10);
    }
    public Node_9 insert(Node_9 root, int key) {
        if (root == null) return new Node_9(key);
        if (key < root.key) root.left = insert(root.left, key);
        else if (key > root.key) root.right = insert(root.right, key);
        else return root;

        root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
        int bal = getBalance(root);

        if (bal > 1 && key < root.left.key) return rightRotate(root);
        if (bal < -1 && key > root.right.key) return leftRotate(root);
        if (bal > 1 && key > root.left.key) {
            root.left = leftRotate(root.left);
            return rightRotate(root);
        }
        if (bal < -1 && key < root.right.key) {
            root.right = rightRotate(root.right);
            return leftRotate(root);
        }
        return root;
    }
    public Node_9 leftRotate(Node_9 x) {
        Node_9 y = x.right;
        Node_9 t2 = y.left;
        y.left = x;
        x.right = t2;
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
        return y;
    }
    public Node_9 rightRotate(Node_9 y) {
        Node_9 x = y.left;
        Node_9 t2 = x.right;
        x.right = y;
        y.left = t2;
        y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
        x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
        return x;
    }
    public int getHeight(Node_9 node) {
        return (node == null) ? 0 : node.height;
    }
    public int getBalance(Node_9 node) {
        return (node == null) ? 0 : (getHeight(node.left) - getHeight(node.right));
    }
}
