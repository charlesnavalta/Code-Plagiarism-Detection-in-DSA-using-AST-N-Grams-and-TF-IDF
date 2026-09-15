public class DSU_8 {
    public static void main(String[] args) {
        DSU_8 dsu = new DSU_8(10);
        dsu.u_8(1, 2);
    }
    int[] p_8;
    int[] r_8;
    public DSU_8(int tot_8) {
        p_8 = new int[tot_8];
        r_8 = new int[tot_8];
        for (int idx = 0; idx < tot_8; idx++) {
            p_8[idx] = idx;
            r_8[idx] = 0;
        }
    }
    public int f_8(int x_8) {
        if (p_8[x_8] != x_8) {
            p_8[x_8] = f_8(p_8[x_8]);
        }
        return p_8[x_8];
    }
    public void u_8(int a_8, int b_8) {
        int ra_8 = f_8(a_8);
        int rb_8 = f_8(b_8);
        if (ra_8 != rb_8) {
            if (r_8[ra_8] < r_8[rb_8]) {
                p_8[ra_8] = rb_8;
            } else if (r_8[ra_8] > r_8[rb_8]) {
                p_8[rb_8] = ra_8;
            } else {
                p_8[rb_8] = ra_8;
                r_8[ra_8]++;
            }
        }
    }
}