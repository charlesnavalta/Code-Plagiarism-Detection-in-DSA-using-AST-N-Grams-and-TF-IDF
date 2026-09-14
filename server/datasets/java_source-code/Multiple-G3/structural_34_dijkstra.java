import java.util.*;
public class Dijk_9 {
    public static void main(String[] args) {
        Dijk_9 da = new Dijk_9();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_9(g, 0);
    }
    public int ext_9(int[] d_9, boolean[] vis_9, int nv_9) {
        int sv_9 = -1;
        int cmin_9 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_9; v++) {
            if (!vis_9[v] && d_9[v] <= cmin_9) {
                cmin_9 = d_9[v];
                sv_9 = v;
            }
        }
        return sv_9;
    }
    public int[] dist_9(int[][] gm_9, int src_9) {
        int nv_9 = gm_9.length;
        int[] d_9 = new int[nv_9];
        boolean[] vis_9 = new boolean[nv_9];
        for (int i = 0; i < nv_9; i++) {
            d_9[i] = Integer.MAX_VALUE;
            vis_9[i] = false;
        }
        d_9[src_9] = 0;
        int cnt_9 = 0;
        while (cnt_9 < nv_9 - 1) {
            int u = ext_9(d_9, vis_9, nv_9);
            if (u == -1) break;
            vis_9[u] = true;
            for (int v = 0; v < nv_9; v++) {
                if (!vis_9[v] && gm_9[u][v] != 0 && d_9[u] != Integer.MAX_VALUE && d_9[u] + gm_9[u][v] < d_9[v]) {
                    d_9[v] = d_9[u] + gm_9[u][v];
                }
            }
            cnt_9++;
        }
        return d_9;
    }
}