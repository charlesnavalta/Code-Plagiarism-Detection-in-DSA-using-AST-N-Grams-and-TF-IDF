public class DSU_5 {
    public static void main(String[] args) {
        DSU_5 dsu = new DSU_5(10);
        dsu.u_5(1, 2);
    }
    int[] p_5;
    int[] r_5;
    public DSU_5(int tot_5) {
        p_5 = new int[tot_5];
        r_5 = new int[tot_5];
        for (int idx = 0; idx < tot_5; idx++) {
            p_5[idx] = idx;
            r_5[idx] = 0;
        }
    }
    public int f_5(int x_5) {
        if (p_5[x_5] != x_5) {
            p_5[x_5] = f_5(p_5[x_5]);
        }
        return p_5[x_5];
    }
    public void u_5(int a_5, int b_5) {
        int ra_5 = f_5(a_5);
        int rb_5 = f_5(b_5);
        if (ra_5 != rb_5) {
            if (r_5[ra_5] < r_5[rb_5]) {
                p_5[ra_5] = rb_5;
            } else if (r_5[ra_5] > r_5[rb_5]) {
                p_5[rb_5] = ra_5;
            } else {
                p_5[rb_5] = ra_5;
                r_5[ra_5]++;
            }
        }
    }
}