class Node_8 {
    int key, height;
    Node_8 left, right;
    Node_8(int val) {
        key = val;
        height = 1;
    }
}
public class Tree_8 {
    public static void main(String[] args) {
        Tree_8 t = new Tree_8();
        Node_8 r = t.insert(null, 10);
    }
    public Node_8 insert(Node_8 root, int val) {
        if (root == null) return new Node_8(val);
        if (val < root.key) root.left = insert(root.left, val);
        else if (val > root.key) root.right = insert(root.right, val);
        else return root;

        root.height = 1 + Math.max(height(root.left), height(root.right));
        int b = diff(root);
        if (b > 1 && val < root.left.key) return turnRight(root);
        if (b < -1 && val > root.right.key) return turnLeft(root);
        if (b > 1 && val > root.left.key) {
            root.left = turnLeft(root.left);
            return turnRight(root);
        }
        if (b < -1 && val < root.right.key) {
            root.right = turnRight(root.right);
            return turnLeft(root);
        }
        return root;
    }
    public Node_8 turnRight(Node_8 y) {
        Node_8 x = y.left;
        Node_8 sub = x.right;
        x.right = y;
        y.left = sub;
        y.height = 1 + Math.max(height(y.left), height(y.right));
        x.height = 1 + Math.max(height(x.left), height(x.right));
        return x;
    }
    public Node_8 turnLeft(Node_8 x) {
        Node_8 y = x.right;
        Node_8 sub = y.left;
        y.left = x;
        x.right = sub;
        x.height = 1 + Math.max(height(x.left), height(x.right));
        y.height = 1 + Math.max(height(y.left), height(y.right));
        return y;
    }
    public int height(Node_8 n) {
        return (n == null) ? 0 : n.height;
    }
    public int diff(Node_8 n) {
        return (n == null) ? 0 : (height(n.left) - height(n.right));
    }
}
