class Node_6 {
    int k_6, h_6;
    Node_6 left, right;
    Node_6(int d) {
        k_6 = d;
        h_6 = 1;
    }
}
public class Tree_6 {
    public static void main(String[] args) {
        Tree_6 t = new Tree_6();
        Node_6 r = null;
        r = t.ins_6(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_6(Node_6 N) {
        if (N == null) return 0;
        return N.h_6;
    }
    int gb_6(Node_6 N) {
        if (N == null) return 0;
        return h_6(N.left) - h_6(N.right);
    }
    Node_6 upd_6(Node_6 n_6) {
        n_6.h_6 = 1 + max(h_6(n_6.left), h_6(n_6.right));
        return n_6;
    }
    Node_6 rr_6(Node_6 y) {
        Node_6 x = y.left;
        Node_6 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_6(y);
        upd_6(x);
        return x;
    }
    Node_6 rl_6(Node_6 x) {
        Node_6 y = x.right;
        Node_6 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_6(x);
        upd_6(y);
        return y;
    }
    Node_6 ins_6(Node_6 n_6, int k_6) {
        if (n_6 == null) return (new Node_6(k_6));
        if (k_6 < n_6.k_6) n_6.left = ins_6(n_6.left, k_6);
        else if (k_6 > n_6.k_6) n_6.right = ins_6(n_6.right, k_6);
        else return n_6;
        upd_6(n_6);
        int b_6 = gb_6(n_6);
        if (b_6 > 1 && k_6 < n_6.left.k_6) return rr_6(n_6);
        if (b_6 < -1 && k_6 > n_6.right.k_6) return rl_6(n_6);
        if (b_6 > 1 && k_6 > n_6.left.k_6) {
            n_6.left = rl_6(n_6.left);
            return rr_6(n_6);
        }
        if (b_6 < -1 && k_6 < n_6.right.k_6) {
            n_6.right = rr_6(n_6.right);
            return rl_6(n_6);
        }
        return n_6;
    }
}