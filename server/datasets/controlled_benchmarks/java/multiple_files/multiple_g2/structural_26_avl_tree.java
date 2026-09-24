class Node_1 {
    int k_1, h_1;
    Node_1 left, right;
    Node_1(int d) {
        k_1 = d;
        h_1 = 1;
    }
}
public class Tree_1 {
    public static void main(String[] args) {
        Tree_1 t = new Tree_1();
        Node_1 r = null;
        r = t.ins_1(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_1(Node_1 N) {
        if (N == null) return 0;
        return N.h_1;
    }
    int gb_1(Node_1 N) {
        if (N == null) return 0;
        return h_1(N.left) - h_1(N.right);
    }
    Node_1 upd_1(Node_1 n_1) {
        n_1.h_1 = 1 + max(h_1(n_1.left), h_1(n_1.right));
        return n_1;
    }
    Node_1 rr_1(Node_1 y) {
        Node_1 x = y.left;
        Node_1 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_1(y);
        upd_1(x);
        return x;
    }
    Node_1 rl_1(Node_1 x) {
        Node_1 y = x.right;
        Node_1 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_1(x);
        upd_1(y);
        return y;
    }
    Node_1 ins_1(Node_1 n_1, int k_1) {
        if (n_1 == null) return (new Node_1(k_1));
        if (k_1 < n_1.k_1) n_1.left = ins_1(n_1.left, k_1);
        else if (k_1 > n_1.k_1) n_1.right = ins_1(n_1.right, k_1);
        else return n_1;
        upd_1(n_1);
        int b_1 = gb_1(n_1);
        if (b_1 > 1 && k_1 < n_1.left.k_1) return rr_1(n_1);
        if (b_1 < -1 && k_1 > n_1.right.k_1) return rl_1(n_1);
        if (b_1 > 1 && k_1 > n_1.left.k_1) {
            n_1.left = rl_1(n_1.left);
            return rr_1(n_1);
        }
        if (b_1 < -1 && k_1 < n_1.right.k_1) {
            n_1.right = rr_1(n_1.right);
            return rl_1(n_1);
        }
        return n_1;
    }
}