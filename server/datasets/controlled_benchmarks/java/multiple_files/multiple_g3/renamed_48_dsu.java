public class DSU_12 {
    public static void main(String[] args) {
        DSU_12 dsu = new DSU_12(10);
        dsu.u_12(1, 2);
    }
    int[] p_12;
    int[] r_12;
    public DSU_12(int tot_12) {
        p_12 = new int[tot_12];
        r_12 = new int[tot_12];
        for (int idx = 0; idx < tot_12; idx++) {
            p_12[idx] = idx;
            r_12[idx] = 0;
        }
    }
    public int f_12(int x_12) {
        if (p_12[x_12] != x_12) {
            p_12[x_12] = f_12(p_12[x_12]);
        }
        return p_12[x_12];
    }
    public void u_12(int a_12, int b_12) {
        int ra_12 = f_12(a_12);
        int rb_12 = f_12(b_12);
        if (ra_12 != rb_12) {
            if (r_12[ra_12] < r_12[rb_12]) {
                p_12[ra_12] = rb_12;
            } else if (r_12[ra_12] > r_12[rb_12]) {
                p_12[rb_12] = ra_12;
            } else {
                p_12[rb_12] = ra_12;
                r_12[ra_12]++;
            }
        }
    }
}