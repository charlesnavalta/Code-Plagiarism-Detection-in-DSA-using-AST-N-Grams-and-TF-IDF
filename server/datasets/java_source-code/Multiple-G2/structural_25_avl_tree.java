class Node_0 {
    int k_0, h_0;
    Node_0 left, right;
    Node_0(int d) {
        k_0 = d;
        h_0 = 1;
    }
}
public class Tree_0 {
    public static void main(String[] args) {
        Tree_0 t = new Tree_0();
        Node_0 r = null;
        r = t.ins_0(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_0(Node_0 N) {
        if (N == null) return 0;
        return N.h_0;
    }
    int gb_0(Node_0 N) {
        if (N == null) return 0;
        return h_0(N.left) - h_0(N.right);
    }
    Node_0 upd_0(Node_0 n_0) {
        n_0.h_0 = 1 + max(h_0(n_0.left), h_0(n_0.right));
        return n_0;
    }
    Node_0 rr_0(Node_0 y) {
        Node_0 x = y.left;
        Node_0 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_0(y);
        upd_0(x);
        return x;
    }
    Node_0 rl_0(Node_0 x) {
        Node_0 y = x.right;
        Node_0 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_0(x);
        upd_0(y);
        return y;
    }
    Node_0 ins_0(Node_0 n_0, int k_0) {
        if (n_0 == null) return (new Node_0(k_0));
        if (k_0 < n_0.k_0) n_0.left = ins_0(n_0.left, k_0);
        else if (k_0 > n_0.k_0) n_0.right = ins_0(n_0.right, k_0);
        else return n_0;
        upd_0(n_0);
        int b_0 = gb_0(n_0);
        if (b_0 > 1 && k_0 < n_0.left.k_0) return rr_0(n_0);
        if (b_0 < -1 && k_0 > n_0.right.k_0) return rl_0(n_0);
        if (b_0 > 1 && k_0 > n_0.left.k_0) {
            n_0.left = rl_0(n_0.left);
            return rr_0(n_0);
        }
        if (b_0 < -1 && k_0 < n_0.right.k_0) {
            n_0.right = rr_0(n_0.right);
            return rl_0(n_0);
        }
        return n_0;
    }
}