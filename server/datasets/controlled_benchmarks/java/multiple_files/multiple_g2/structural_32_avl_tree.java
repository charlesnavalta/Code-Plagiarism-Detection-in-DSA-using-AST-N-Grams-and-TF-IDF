class Node_7 {
    int key, height;
    Node_7 left, right;
    Node_7(int k) {
        key = k;
        height = 1;
    }
}
public class Tree_7 {
    public static void main(String[] args) {
        Tree_7 t = new Tree_7();
        Node_7 r = t.insert(null, 10);
    }
    public Node_7 insert(Node_7 root, int key) {
        if (root == null) return new Node_7(key);
        if (key < root.key) root.left = insert(root.left, key);
        else if (key > root.key) root.right = insert(root.right, key);
        else return root;

        int lh = getH(root.left);
        int rh = getH(root.right);
        root.height = 1 + (lh > rh ? lh : rh);
        int b = getBal(root);

        if (b > 1 && key < root.left.key) return rightRotate(root);
        if (b < -1 && key > root.right.key) return leftRotate(root);
        if (b > 1 && key > root.left.key) {
            root.left = leftRotate(root.left);
            return rightRotate(root);
        }
        if (b < -1 && key < root.right.key) {
            root.right = rightRotate(root.right);
            return leftRotate(root);
        }
        return root;
    }
    public Node_7 rightRotate(Node_7 y) {
        Node_7 x = y.left;
        Node_7 t2 = x.right;
        x.right = y;
        y.left = t2;
        int lh_y = getH(y.left);
        int rh_y = getH(y.right);
        y.height = 1 + (lh_y > rh_y ? lh_y : rh_y);
        int lh_x = getH(x.left);
        int rh_x = getH(x.right);
        x.height = 1 + (lh_x > rh_x ? lh_x : rh_x);
        return x;
    }
    public Node_7 leftRotate(Node_7 x) {
        Node_7 y = x.right;
        Node_7 t2 = y.left;
        y.left = x;
        x.right = t2;
        int lh_x = getH(x.left);
        int rh_x = getH(x.right);
        x.height = 1 + (lh_x > rh_x ? lh_x : rh_x);
        int lh_y = getH(y.left);
        int rh_y = getH(y.right);
        y.height = 1 + (lh_y > rh_y ? lh_y : rh_y);
        return y;
    }
    public int getH(Node_7 n) {
        return (n == null) ? 0 : n.height;
    }
    public int getBal(Node_7 n) {
        return (n == null) ? 0 : (getH(n.left) - getH(n.right));
    }
}
