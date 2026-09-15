import java.util.*;
public class Dijk_5 {
    public static void main(String[] args) {
        Dijk_5 da = new Dijk_5();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_5(g, 0);
    }
    public int ext_5(int[] d_5, boolean[] vis_5, int nv_5) {
        int sv_5 = -1;
        int cmin_5 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_5; v++) {
            if (!vis_5[v] && d_5[v] <= cmin_5) {
                cmin_5 = d_5[v];
                sv_5 = v;
            }
        }
        return sv_5;
    }
    public int[] dist_5(int[][] gm_5, int src_5) {
        int nv_5 = gm_5.length;
        int[] d_5 = new int[nv_5];
        boolean[] vis_5 = new boolean[nv_5];
        for (int i = 0; i < nv_5; i++) {
            d_5[i] = Integer.MAX_VALUE;
            vis_5[i] = false;
        }
        d_5[src_5] = 0;
        int cnt_5 = 0;
        while (cnt_5 < nv_5 - 1) {
            int u = ext_5(d_5, vis_5, nv_5);
            if (u == -1) break;
            vis_5[u] = true;
            for (int v = 0; v < nv_5; v++) {
                if (!vis_5[v] && gm_5[u][v] != 0 && d_5[u] != Integer.MAX_VALUE && d_5[u] + gm_5[u][v] < d_5[v]) {
                    d_5[v] = d_5[u] + gm_5[u][v];
                }
            }
            cnt_5++;
        }
        return d_5;
    }
}