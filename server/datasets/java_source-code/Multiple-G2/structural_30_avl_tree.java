class Node_5 {
    int k_5, h_5;
    Node_5 left, right;
    Node_5(int d) {
        k_5 = d;
        h_5 = 1;
    }
}
public class Tree_5 {
    public static void main(String[] args) {
        Tree_5 t = new Tree_5();
        Node_5 r = null;
        r = t.ins_5(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_5(Node_5 N) {
        if (N == null) return 0;
        return N.h_5;
    }
    int gb_5(Node_5 N) {
        if (N == null) return 0;
        return h_5(N.left) - h_5(N.right);
    }
    Node_5 upd_5(Node_5 n_5) {
        n_5.h_5 = 1 + max(h_5(n_5.left), h_5(n_5.right));
        return n_5;
    }
    Node_5 rr_5(Node_5 y) {
        Node_5 x = y.left;
        Node_5 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_5(y);
        upd_5(x);
        return x;
    }
    Node_5 rl_5(Node_5 x) {
        Node_5 y = x.right;
        Node_5 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_5(x);
        upd_5(y);
        return y;
    }
    Node_5 ins_5(Node_5 n_5, int k_5) {
        if (n_5 == null) return (new Node_5(k_5));
        if (k_5 < n_5.k_5) n_5.left = ins_5(n_5.left, k_5);
        else if (k_5 > n_5.k_5) n_5.right = ins_5(n_5.right, k_5);
        else return n_5;
        upd_5(n_5);
        int b_5 = gb_5(n_5);
        if (b_5 > 1 && k_5 < n_5.left.k_5) return rr_5(n_5);
        if (b_5 < -1 && k_5 > n_5.right.k_5) return rl_5(n_5);
        if (b_5 > 1 && k_5 > n_5.left.k_5) {
            n_5.left = rl_5(n_5.left);
            return rr_5(n_5);
        }
        if (b_5 < -1 && k_5 < n_5.right.k_5) {
            n_5.right = rr_5(n_5.right);
            return rl_5(n_5);
        }
        return n_5;
    }
}