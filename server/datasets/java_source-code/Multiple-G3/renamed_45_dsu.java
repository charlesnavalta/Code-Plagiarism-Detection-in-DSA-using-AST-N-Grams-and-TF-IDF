public class DSU_9 {
    public static void main(String[] args) {
        DSU_9 dsu = new DSU_9(10);
        dsu.u_9(1, 2);
    }
    int[] p_9;
    int[] r_9;
    public DSU_9(int tot_9) {
        p_9 = new int[tot_9];
        r_9 = new int[tot_9];
        for (int idx = 0; idx < tot_9; idx++) {
            p_9[idx] = idx;
            r_9[idx] = 0;
        }
    }
    public int f_9(int x_9) {
        if (p_9[x_9] != x_9) {
            p_9[x_9] = f_9(p_9[x_9]);
        }
        return p_9[x_9];
    }
    public void u_9(int a_9, int b_9) {
        int ra_9 = f_9(a_9);
        int rb_9 = f_9(b_9);
        if (ra_9 != rb_9) {
            if (r_9[ra_9] < r_9[rb_9]) {
                p_9[ra_9] = rb_9;
            } else if (r_9[ra_9] > r_9[rb_9]) {
                p_9[rb_9] = ra_9;
            } else {
                p_9[rb_9] = ra_9;
                r_9[ra_9]++;
            }
        }
    }
}