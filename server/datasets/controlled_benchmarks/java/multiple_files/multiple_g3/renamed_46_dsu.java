public class DSU_10 {
    public static void main(String[] args) {
        DSU_10 dsu = new DSU_10(10);
        dsu.u_10(1, 2);
    }
    int[] p_10;
    int[] r_10;
    public DSU_10(int tot_10) {
        p_10 = new int[tot_10];
        r_10 = new int[tot_10];
        for (int idx = 0; idx < tot_10; idx++) {
            p_10[idx] = idx;
            r_10[idx] = 0;
        }
    }
    public int f_10(int x_10) {
        if (p_10[x_10] != x_10) {
            p_10[x_10] = f_10(p_10[x_10]);
        }
        return p_10[x_10];
    }
    public void u_10(int a_10, int b_10) {
        int ra_10 = f_10(a_10);
        int rb_10 = f_10(b_10);
        if (ra_10 != rb_10) {
            if (r_10[ra_10] < r_10[rb_10]) {
                p_10[ra_10] = rb_10;
            } else if (r_10[ra_10] > r_10[rb_10]) {
                p_10[rb_10] = ra_10;
            } else {
                p_10[rb_10] = ra_10;
                r_10[ra_10]++;
            }
        }
    }
}