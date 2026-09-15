class Node_2 {
    int k_2, h_2;
    Node_2 left, right;
    Node_2(int d) {
        k_2 = d;
        h_2 = 1;
    }
}
public class Tree_2 {
    public static void main(String[] args) {
        Tree_2 t = new Tree_2();
        Node_2 r = null;
        r = t.ins_2(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_2(Node_2 N) {
        if (N == null) return 0;
        return N.h_2;
    }
    int gb_2(Node_2 N) {
        if (N == null) return 0;
        return h_2(N.left) - h_2(N.right);
    }
    Node_2 upd_2(Node_2 n_2) {
        n_2.h_2 = 1 + max(h_2(n_2.left), h_2(n_2.right));
        return n_2;
    }
    Node_2 rr_2(Node_2 y) {
        Node_2 x = y.left;
        Node_2 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_2(y);
        upd_2(x);
        return x;
    }
    Node_2 rl_2(Node_2 x) {
        Node_2 y = x.right;
        Node_2 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_2(x);
        upd_2(y);
        return y;
    }
    Node_2 ins_2(Node_2 n_2, int k_2) {
        if (n_2 == null) return (new Node_2(k_2));
        if (k_2 < n_2.k_2) n_2.left = ins_2(n_2.left, k_2);
        else if (k_2 > n_2.k_2) n_2.right = ins_2(n_2.right, k_2);
        else return n_2;
        upd_2(n_2);
        int b_2 = gb_2(n_2);
        if (b_2 > 1 && k_2 < n_2.left.k_2) return rr_2(n_2);
        if (b_2 < -1 && k_2 > n_2.right.k_2) return rl_2(n_2);
        if (b_2 > 1 && k_2 > n_2.left.k_2) {
            n_2.left = rl_2(n_2.left);
            return rr_2(n_2);
        }
        if (b_2 < -1 && k_2 < n_2.right.k_2) {
            n_2.right = rr_2(n_2.right);
            return rl_2(n_2);
        }
        return n_2;
    }
}