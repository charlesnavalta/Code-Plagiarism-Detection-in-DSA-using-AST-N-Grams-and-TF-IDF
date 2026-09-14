public class DSU_1 {
    public static void main(String[] args) {
        DSU_1 dsu = new DSU_1(10);
        dsu.u_1(1, 2);
    }
    int[] p_1;
    int[] r_1;
    public DSU_1(int tot_1) {
        p_1 = new int[tot_1];
        r_1 = new int[tot_1];
        for (int idx = 0; idx < tot_1; idx++) {
            p_1[idx] = idx;
            r_1[idx] = 0;
        }
    }
    public int f_1(int x_1) {
        if (p_1[x_1] != x_1) {
            p_1[x_1] = f_1(p_1[x_1]);
        }
        return p_1[x_1];
    }
    public void u_1(int a_1, int b_1) {
        int ra_1 = f_1(a_1);
        int rb_1 = f_1(b_1);
        if (ra_1 != rb_1) {
            if (r_1[ra_1] < r_1[rb_1]) {
                p_1[ra_1] = rb_1;
            } else if (r_1[ra_1] > r_1[rb_1]) {
                p_1[rb_1] = ra_1;
            } else {
                p_1[rb_1] = ra_1;
                r_1[ra_1]++;
            }
        }
    }
}