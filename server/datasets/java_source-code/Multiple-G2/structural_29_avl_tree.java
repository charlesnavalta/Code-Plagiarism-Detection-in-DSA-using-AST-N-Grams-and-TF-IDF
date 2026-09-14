class Node_4 {
    int k_4, h_4;
    Node_4 left, right;
    Node_4(int d) {
        k_4 = d;
        h_4 = 1;
    }
}
public class Tree_4 {
    public static void main(String[] args) {
        Tree_4 t = new Tree_4();
        Node_4 r = null;
        r = t.ins_4(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_4(Node_4 N) {
        if (N == null) return 0;
        return N.h_4;
    }
    int gb_4(Node_4 N) {
        if (N == null) return 0;
        return h_4(N.left) - h_4(N.right);
    }
    Node_4 upd_4(Node_4 n_4) {
        n_4.h_4 = 1 + max(h_4(n_4.left), h_4(n_4.right));
        return n_4;
    }
    Node_4 rr_4(Node_4 y) {
        Node_4 x = y.left;
        Node_4 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_4(y);
        upd_4(x);
        return x;
    }
    Node_4 rl_4(Node_4 x) {
        Node_4 y = x.right;
        Node_4 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_4(x);
        upd_4(y);
        return y;
    }
    Node_4 ins_4(Node_4 n_4, int k_4) {
        if (n_4 == null) return (new Node_4(k_4));
        if (k_4 < n_4.k_4) n_4.left = ins_4(n_4.left, k_4);
        else if (k_4 > n_4.k_4) n_4.right = ins_4(n_4.right, k_4);
        else return n_4;
        upd_4(n_4);
        int b_4 = gb_4(n_4);
        if (b_4 > 1 && k_4 < n_4.left.k_4) return rr_4(n_4);
        if (b_4 < -1 && k_4 > n_4.right.k_4) return rl_4(n_4);
        if (b_4 > 1 && k_4 > n_4.left.k_4) {
            n_4.left = rl_4(n_4.left);
            return rr_4(n_4);
        }
        if (b_4 < -1 && k_4 < n_4.right.k_4) {
            n_4.right = rr_4(n_4.right);
            return rl_4(n_4);
        }
        return n_4;
    }
}