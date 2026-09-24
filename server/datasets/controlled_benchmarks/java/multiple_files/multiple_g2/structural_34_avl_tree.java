class Node_9 {
    int k_9, h_9;
    Node_9 left, right;
    Node_9(int d) {
        k_9 = d;
        h_9 = 1;
    }
}
public class Tree_9 {
    public static void main(String[] args) {
        Tree_9 t = new Tree_9();
        Node_9 r = null;
        r = t.ins_9(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_9(Node_9 N) {
        if (N == null) return 0;
        return N.h_9;
    }
    int gb_9(Node_9 N) {
        if (N == null) return 0;
        return h_9(N.left) - h_9(N.right);
    }
    Node_9 upd_9(Node_9 n_9) {
        n_9.h_9 = 1 + max(h_9(n_9.left), h_9(n_9.right));
        return n_9;
    }
    Node_9 rr_9(Node_9 y) {
        Node_9 x = y.left;
        Node_9 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_9(y);
        upd_9(x);
        return x;
    }
    Node_9 rl_9(Node_9 x) {
        Node_9 y = x.right;
        Node_9 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_9(x);
        upd_9(y);
        return y;
    }
    Node_9 ins_9(Node_9 n_9, int k_9) {
        if (n_9 == null) return (new Node_9(k_9));
        if (k_9 < n_9.k_9) n_9.left = ins_9(n_9.left, k_9);
        else if (k_9 > n_9.k_9) n_9.right = ins_9(n_9.right, k_9);
        else return n_9;
        upd_9(n_9);
        int b_9 = gb_9(n_9);
        if (b_9 > 1 && k_9 < n_9.left.k_9) return rr_9(n_9);
        if (b_9 < -1 && k_9 > n_9.right.k_9) return rl_9(n_9);
        if (b_9 > 1 && k_9 > n_9.left.k_9) {
            n_9.left = rl_9(n_9.left);
            return rr_9(n_9);
        }
        if (b_9 < -1 && k_9 < n_9.right.k_9) {
            n_9.right = rr_9(n_9.right);
            return rl_9(n_9);
        }
        return n_9;
    }
}