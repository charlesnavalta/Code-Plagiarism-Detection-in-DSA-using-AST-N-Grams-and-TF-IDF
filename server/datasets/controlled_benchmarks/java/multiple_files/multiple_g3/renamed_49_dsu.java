public class DSU_13 {
    public static void main(String[] args) {
        DSU_13 dsu = new DSU_13(10);
        dsu.u_13(1, 2);
    }
    int[] p_13;
    int[] r_13;
    public DSU_13(int tot_13) {
        p_13 = new int[tot_13];
        r_13 = new int[tot_13];
        for (int idx = 0; idx < tot_13; idx++) {
            p_13[idx] = idx;
            r_13[idx] = 0;
        }
    }
    public int f_13(int x_13) {
        if (p_13[x_13] != x_13) {
            p_13[x_13] = f_13(p_13[x_13]);
        }
        return p_13[x_13];
    }
    public void u_13(int a_13, int b_13) {
        int ra_13 = f_13(a_13);
        int rb_13 = f_13(b_13);
        if (ra_13 != rb_13) {
            if (r_13[ra_13] < r_13[rb_13]) {
                p_13[ra_13] = rb_13;
            } else if (r_13[ra_13] > r_13[rb_13]) {
                p_13[rb_13] = ra_13;
            } else {
                p_13[rb_13] = ra_13;
                r_13[ra_13]++;
            }
        }
    }
}