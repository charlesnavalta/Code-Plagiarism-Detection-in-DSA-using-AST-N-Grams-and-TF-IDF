import java.util.*;
public class Dijk_7 {
    public static void main(String[] args) {
        Dijk_7 da = new Dijk_7();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_7(g, 0);
    }
    public int ext_7(int[] d_7, boolean[] vis_7, int nv_7) {
        int sv_7 = -1;
        int cmin_7 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_7; v++) {
            if (!vis_7[v] && d_7[v] <= cmin_7) {
                cmin_7 = d_7[v];
                sv_7 = v;
            }
        }
        return sv_7;
    }
    public int[] dist_7(int[][] gm_7, int src_7) {
        int nv_7 = gm_7.length;
        int[] d_7 = new int[nv_7];
        boolean[] vis_7 = new boolean[nv_7];
        for (int i = 0; i < nv_7; i++) {
            d_7[i] = Integer.MAX_VALUE;
            vis_7[i] = false;
        }
        d_7[src_7] = 0;
        int cnt_7 = 0;
        while (cnt_7 < nv_7 - 1) {
            int u = ext_7(d_7, vis_7, nv_7);
            if (u == -1) break;
            vis_7[u] = true;
            for (int v = 0; v < nv_7; v++) {
                if (!vis_7[v] && gm_7[u][v] != 0 && d_7[u] != Integer.MAX_VALUE && d_7[u] + gm_7[u][v] < d_7[v]) {
                    d_7[v] = d_7[u] + gm_7[u][v];
                }
            }
            cnt_7++;
        }
        return d_7;
    }
}