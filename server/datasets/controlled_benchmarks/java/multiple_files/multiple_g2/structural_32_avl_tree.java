class Node_7 {
    int k_7, h_7;
    Node_7 left, right;
    Node_7(int d) {
        k_7 = d;
        h_7 = 1;
    }
}
public class Tree_7 {
    public static void main(String[] args) {
        Tree_7 t = new Tree_7();
        Node_7 r = null;
        r = t.ins_7(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_7(Node_7 N) {
        if (N == null) return 0;
        return N.h_7;
    }
    int gb_7(Node_7 N) {
        if (N == null) return 0;
        return h_7(N.left) - h_7(N.right);
    }
    Node_7 upd_7(Node_7 n_7) {
        n_7.h_7 = 1 + max(h_7(n_7.left), h_7(n_7.right));
        return n_7;
    }
    Node_7 rr_7(Node_7 y) {
        Node_7 x = y.left;
        Node_7 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_7(y);
        upd_7(x);
        return x;
    }
    Node_7 rl_7(Node_7 x) {
        Node_7 y = x.right;
        Node_7 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_7(x);
        upd_7(y);
        return y;
    }
    Node_7 ins_7(Node_7 n_7, int k_7) {
        if (n_7 == null) return (new Node_7(k_7));
        if (k_7 < n_7.k_7) n_7.left = ins_7(n_7.left, k_7);
        else if (k_7 > n_7.k_7) n_7.right = ins_7(n_7.right, k_7);
        else return n_7;
        upd_7(n_7);
        int b_7 = gb_7(n_7);
        if (b_7 > 1 && k_7 < n_7.left.k_7) return rr_7(n_7);
        if (b_7 < -1 && k_7 > n_7.right.k_7) return rl_7(n_7);
        if (b_7 > 1 && k_7 > n_7.left.k_7) {
            n_7.left = rl_7(n_7.left);
            return rr_7(n_7);
        }
        if (b_7 < -1 && k_7 < n_7.right.k_7) {
            n_7.right = rr_7(n_7.right);
            return rl_7(n_7);
        }
        return n_7;
    }
}