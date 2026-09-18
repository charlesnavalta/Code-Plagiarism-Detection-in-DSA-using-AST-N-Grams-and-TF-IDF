class Node_8 {
    int k_8, h_8;
    Node_8 left, right;
    Node_8(int d) {
        k_8 = d;
        h_8 = 1;
    }
}
public class Tree_8 {
    public static void main(String[] args) {
        Tree_8 t = new Tree_8();
        Node_8 r = null;
        r = t.ins_8(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_8(Node_8 N) {
        if (N == null) return 0;
        return N.h_8;
    }
    int gb_8(Node_8 N) {
        if (N == null) return 0;
        return h_8(N.left) - h_8(N.right);
    }
    Node_8 upd_8(Node_8 n_8) {
        n_8.h_8 = 1 + max(h_8(n_8.left), h_8(n_8.right));
        return n_8;
    }
    Node_8 rr_8(Node_8 y) {
        Node_8 x = y.left;
        Node_8 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_8(y);
        upd_8(x);
        return x;
    }
    Node_8 rl_8(Node_8 x) {
        Node_8 y = x.right;
        Node_8 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_8(x);
        upd_8(y);
        return y;
    }
    Node_8 ins_8(Node_8 n_8, int k_8) {
        if (n_8 == null) return (new Node_8(k_8));
        if (k_8 < n_8.k_8) n_8.left = ins_8(n_8.left, k_8);
        else if (k_8 > n_8.k_8) n_8.right = ins_8(n_8.right, k_8);
        else return n_8;
        upd_8(n_8);
        int b_8 = gb_8(n_8);
        if (b_8 > 1 && k_8 < n_8.left.k_8) return rr_8(n_8);
        if (b_8 < -1 && k_8 > n_8.right.k_8) return rl_8(n_8);
        if (b_8 > 1 && k_8 > n_8.left.k_8) {
            n_8.left = rl_8(n_8.left);
            return rr_8(n_8);
        }
        if (b_8 < -1 && k_8 < n_8.right.k_8) {
            n_8.right = rr_8(n_8.right);
            return rl_8(n_8);
        }
        return n_8;
    }
}