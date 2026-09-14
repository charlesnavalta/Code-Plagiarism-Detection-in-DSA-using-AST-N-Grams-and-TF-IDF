import java.util.*;
public class Dijk_10 {
    public static void main(String[] args) {
        Dijk_10 da = new Dijk_10();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_10(g, 0);
    }
    public int ext_10(int[] d_10, boolean[] vis_10, int nv_10) {
        int sv_10 = -1;
        int cmin_10 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_10; v++) {
            if (!vis_10[v] && d_10[v] <= cmin_10) {
                cmin_10 = d_10[v];
                sv_10 = v;
            }
        }
        return sv_10;
    }
    public int[] dist_10(int[][] gm_10, int src_10) {
        int nv_10 = gm_10.length;
        int[] d_10 = new int[nv_10];
        boolean[] vis_10 = new boolean[nv_10];
        for (int i = 0; i < nv_10; i++) {
            d_10[i] = Integer.MAX_VALUE;
            vis_10[i] = false;
        }
        d_10[src_10] = 0;
        int cnt_10 = 0;
        while (cnt_10 < nv_10 - 1) {
            int u = ext_10(d_10, vis_10, nv_10);
            if (u == -1) break;
            vis_10[u] = true;
            for (int v = 0; v < nv_10; v++) {
                if (!vis_10[v] && gm_10[u][v] != 0 && d_10[u] != Integer.MAX_VALUE && d_10[u] + gm_10[u][v] < d_10[v]) {
                    d_10[v] = d_10[u] + gm_10[u][v];
                }
            }
            cnt_10++;
        }
        return d_10;
    }
}