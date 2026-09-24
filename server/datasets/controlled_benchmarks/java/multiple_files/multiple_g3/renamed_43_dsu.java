public class DSU_7 {
    public static void main(String[] args) {
        DSU_7 dsu = new DSU_7(10);
        dsu.u_7(1, 2);
    }
    int[] p_7;
    int[] r_7;
    public DSU_7(int tot_7) {
        p_7 = new int[tot_7];
        r_7 = new int[tot_7];
        for (int idx = 0; idx < tot_7; idx++) {
            p_7[idx] = idx;
            r_7[idx] = 0;
        }
    }
    public int f_7(int x_7) {
        if (p_7[x_7] != x_7) {
            p_7[x_7] = f_7(p_7[x_7]);
        }
        return p_7[x_7];
    }
    public void u_7(int a_7, int b_7) {
        int ra_7 = f_7(a_7);
        int rb_7 = f_7(b_7);
        if (ra_7 != rb_7) {
            if (r_7[ra_7] < r_7[rb_7]) {
                p_7[ra_7] = rb_7;
            } else if (r_7[ra_7] > r_7[rb_7]) {
                p_7[rb_7] = ra_7;
            } else {
                p_7[rb_7] = ra_7;
                r_7[ra_7]++;
            }
        }
    }
}