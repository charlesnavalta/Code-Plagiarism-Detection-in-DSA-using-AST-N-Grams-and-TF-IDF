public class DSU_3 {
    public static void main(String[] args) {
        DSU_3 dsu = new DSU_3(10);
        dsu.u_3(1, 2);
    }
    int[] p_3;
    int[] r_3;
    public DSU_3(int tot_3) {
        p_3 = new int[tot_3];
        r_3 = new int[tot_3];
        for (int idx = 0; idx < tot_3; idx++) {
            p_3[idx] = idx;
            r_3[idx] = 0;
        }
    }
    public int f_3(int x_3) {
        if (p_3[x_3] != x_3) {
            p_3[x_3] = f_3(p_3[x_3]);
        }
        return p_3[x_3];
    }
    public void u_3(int a_3, int b_3) {
        int ra_3 = f_3(a_3);
        int rb_3 = f_3(b_3);
        if (ra_3 != rb_3) {
            if (r_3[ra_3] < r_3[rb_3]) {
                p_3[ra_3] = rb_3;
            } else if (r_3[ra_3] > r_3[rb_3]) {
                p_3[rb_3] = ra_3;
            } else {
                p_3[rb_3] = ra_3;
                r_3[ra_3]++;
            }
        }
    }
}