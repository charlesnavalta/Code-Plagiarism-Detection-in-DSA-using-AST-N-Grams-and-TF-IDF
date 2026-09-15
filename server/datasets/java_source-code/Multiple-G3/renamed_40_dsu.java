public class DSU_4 {
    public static void main(String[] args) {
        DSU_4 dsu = new DSU_4(10);
        dsu.u_4(1, 2);
    }
    int[] p_4;
    int[] r_4;
    public DSU_4(int tot_4) {
        p_4 = new int[tot_4];
        r_4 = new int[tot_4];
        for (int idx = 0; idx < tot_4; idx++) {
            p_4[idx] = idx;
            r_4[idx] = 0;
        }
    }
    public int f_4(int x_4) {
        if (p_4[x_4] != x_4) {
            p_4[x_4] = f_4(p_4[x_4]);
        }
        return p_4[x_4];
    }
    public void u_4(int a_4, int b_4) {
        int ra_4 = f_4(a_4);
        int rb_4 = f_4(b_4);
        if (ra_4 != rb_4) {
            if (r_4[ra_4] < r_4[rb_4]) {
                p_4[ra_4] = rb_4;
            } else if (r_4[ra_4] > r_4[rb_4]) {
                p_4[rb_4] = ra_4;
            } else {
                p_4[rb_4] = ra_4;
                r_4[ra_4]++;
            }
        }
    }
}