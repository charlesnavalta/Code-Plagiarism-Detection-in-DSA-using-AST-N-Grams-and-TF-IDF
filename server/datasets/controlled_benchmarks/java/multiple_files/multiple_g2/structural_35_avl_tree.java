class Node_10 {
    int k_10, h_10;
    Node_10 left, right;
    Node_10(int d) {
        k_10 = d;
        h_10 = 1;
    }
}
public class Tree_10 {
    public static void main(String[] args) {
        Tree_10 t = new Tree_10();
        Node_10 r = null;
        r = t.ins_10(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_10(Node_10 N) {
        if (N == null) return 0;
        return N.h_10;
    }
    int gb_10(Node_10 N) {
        if (N == null) return 0;
        return h_10(N.left) - h_10(N.right);
    }
    Node_10 upd_10(Node_10 n_10) {
        n_10.h_10 = 1 + max(h_10(n_10.left), h_10(n_10.right));
        return n_10;
    }
    Node_10 rr_10(Node_10 y) {
        Node_10 x = y.left;
        Node_10 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_10(y);
        upd_10(x);
        return x;
    }
    Node_10 rl_10(Node_10 x) {
        Node_10 y = x.right;
        Node_10 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_10(x);
        upd_10(y);
        return y;
    }
    Node_10 ins_10(Node_10 n_10, int k_10) {
        if (n_10 == null) return (new Node_10(k_10));
        if (k_10 < n_10.k_10) n_10.left = ins_10(n_10.left, k_10);
        else if (k_10 > n_10.k_10) n_10.right = ins_10(n_10.right, k_10);
        else return n_10;
        upd_10(n_10);
        int b_10 = gb_10(n_10);
        if (b_10 > 1 && k_10 < n_10.left.k_10) return rr_10(n_10);
        if (b_10 < -1 && k_10 > n_10.right.k_10) return rl_10(n_10);
        if (b_10 > 1 && k_10 > n_10.left.k_10) {
            n_10.left = rl_10(n_10.left);
            return rr_10(n_10);
        }
        if (b_10 < -1 && k_10 < n_10.right.k_10) {
            n_10.right = rr_10(n_10.right);
            return rl_10(n_10);
        }
        return n_10;
    }
}