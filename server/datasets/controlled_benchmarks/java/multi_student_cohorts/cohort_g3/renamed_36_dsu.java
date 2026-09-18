public class DSU_0 {
    public static void main(String[] args) {
        DSU_0 dsu = new DSU_0(10);
        dsu.u_0(1, 2);
    }
    int[] p_0;
    int[] r_0;
    public DSU_0(int tot_0) {
        p_0 = new int[tot_0];
        r_0 = new int[tot_0];
        for (int idx = 0; idx < tot_0; idx++) {
            p_0[idx] = idx;
            r_0[idx] = 0;
        }
    }
    public int f_0(int x_0) {
        if (p_0[x_0] != x_0) {
            p_0[x_0] = f_0(p_0[x_0]);
        }
        return p_0[x_0];
    }
    public void u_0(int a_0, int b_0) {
        int ra_0 = f_0(a_0);
        int rb_0 = f_0(b_0);
        if (ra_0 != rb_0) {
            if (r_0[ra_0] < r_0[rb_0]) {
                p_0[ra_0] = rb_0;
            } else if (r_0[ra_0] > r_0[rb_0]) {
                p_0[rb_0] = ra_0;
            } else {
                p_0[rb_0] = ra_0;
                r_0[ra_0]++;
            }
        }
    }
}