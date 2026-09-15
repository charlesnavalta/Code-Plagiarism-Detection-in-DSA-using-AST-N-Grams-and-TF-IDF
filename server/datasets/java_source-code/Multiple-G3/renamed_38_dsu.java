public class DSU_2 {
    public static void main(String[] args) {
        DSU_2 dsu = new DSU_2(10);
        dsu.u_2(1, 2);
    }
    int[] p_2;
    int[] r_2;
    public DSU_2(int tot_2) {
        p_2 = new int[tot_2];
        r_2 = new int[tot_2];
        for (int idx = 0; idx < tot_2; idx++) {
            p_2[idx] = idx;
            r_2[idx] = 0;
        }
    }
    public int f_2(int x_2) {
        if (p_2[x_2] != x_2) {
            p_2[x_2] = f_2(p_2[x_2]);
        }
        return p_2[x_2];
    }
    public void u_2(int a_2, int b_2) {
        int ra_2 = f_2(a_2);
        int rb_2 = f_2(b_2);
        if (ra_2 != rb_2) {
            if (r_2[ra_2] < r_2[rb_2]) {
                p_2[ra_2] = rb_2;
            } else if (r_2[ra_2] > r_2[rb_2]) {
                p_2[rb_2] = ra_2;
            } else {
                p_2[rb_2] = ra_2;
                r_2[ra_2]++;
            }
        }
    }
}