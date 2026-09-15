class Node_3 {
    int k_3, h_3;
    Node_3 left, right;
    Node_3(int d) {
        k_3 = d;
        h_3 = 1;
    }
}
public class Tree_3 {
    public static void main(String[] args) {
        Tree_3 t = new Tree_3();
        Node_3 r = null;
        r = t.ins_3(r, 10);
    }
    int max(int a, int b) {
        return (a > b) ? a : b;
    }
    int h_3(Node_3 N) {
        if (N == null) return 0;
        return N.h_3;
    }
    int gb_3(Node_3 N) {
        if (N == null) return 0;
        return h_3(N.left) - h_3(N.right);
    }
    Node_3 upd_3(Node_3 n_3) {
        n_3.h_3 = 1 + max(h_3(n_3.left), h_3(n_3.right));
        return n_3;
    }
    Node_3 rr_3(Node_3 y) {
        Node_3 x = y.left;
        Node_3 T2 = x.right;
        x.right = y;
        y.left = T2;
        upd_3(y);
        upd_3(x);
        return x;
    }
    Node_3 rl_3(Node_3 x) {
        Node_3 y = x.right;
        Node_3 T2 = y.left;
        y.left = x;
        x.right = T2;
        upd_3(x);
        upd_3(y);
        return y;
    }
    Node_3 ins_3(Node_3 n_3, int k_3) {
        if (n_3 == null) return (new Node_3(k_3));
        if (k_3 < n_3.k_3) n_3.left = ins_3(n_3.left, k_3);
        else if (k_3 > n_3.k_3) n_3.right = ins_3(n_3.right, k_3);
        else return n_3;
        upd_3(n_3);
        int b_3 = gb_3(n_3);
        if (b_3 > 1 && k_3 < n_3.left.k_3) return rr_3(n_3);
        if (b_3 < -1 && k_3 > n_3.right.k_3) return rl_3(n_3);
        if (b_3 > 1 && k_3 > n_3.left.k_3) {
            n_3.left = rl_3(n_3.left);
            return rr_3(n_3);
        }
        if (b_3 < -1 && k_3 < n_3.right.k_3) {
            n_3.right = rr_3(n_3.right);
            return rl_3(n_3);
        }
        return n_3;
    }
}