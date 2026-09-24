public class DSU_11 {
    public static void main(String[] args) {
        DSU_11 dsu = new DSU_11(10);
        dsu.u_11(1, 2);
    }
    int[] p_11;
    int[] r_11;
    public DSU_11(int tot_11) {
        p_11 = new int[tot_11];
        r_11 = new int[tot_11];
        for (int idx = 0; idx < tot_11; idx++) {
            p_11[idx] = idx;
            r_11[idx] = 0;
        }
    }
    public int f_11(int x_11) {
        if (p_11[x_11] != x_11) {
            p_11[x_11] = f_11(p_11[x_11]);
        }
        return p_11[x_11];
    }
    public void u_11(int a_11, int b_11) {
        int ra_11 = f_11(a_11);
        int rb_11 = f_11(b_11);
        if (ra_11 != rb_11) {
            if (r_11[ra_11] < r_11[rb_11]) {
                p_11[ra_11] = rb_11;
            } else if (r_11[ra_11] > r_11[rb_11]) {
                p_11[rb_11] = ra_11;
            } else {
                p_11[rb_11] = ra_11;
                r_11[ra_11]++;
            }
        }
    }
}