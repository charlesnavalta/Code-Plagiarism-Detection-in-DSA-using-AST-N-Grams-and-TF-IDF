public class DSU_6 {
    public static void main(String[] args) {
        DSU_6 dsu = new DSU_6(10);
        dsu.u_6(1, 2);
    }
    int[] p_6;
    int[] r_6;
    public DSU_6(int tot_6) {
        p_6 = new int[tot_6];
        r_6 = new int[tot_6];
        for (int idx = 0; idx < tot_6; idx++) {
            p_6[idx] = idx;
            r_6[idx] = 0;
        }
    }
    public int f_6(int x_6) {
        if (p_6[x_6] != x_6) {
            p_6[x_6] = f_6(p_6[x_6]);
        }
        return p_6[x_6];
    }
    public void u_6(int a_6, int b_6) {
        int ra_6 = f_6(a_6);
        int rb_6 = f_6(b_6);
        if (ra_6 != rb_6) {
            if (r_6[ra_6] < r_6[rb_6]) {
                p_6[ra_6] = rb_6;
            } else if (r_6[ra_6] > r_6[rb_6]) {
                p_6[rb_6] = ra_6;
            } else {
                p_6[rb_6] = ra_6;
                r_6[ra_6]++;
            }
        }
    }
}