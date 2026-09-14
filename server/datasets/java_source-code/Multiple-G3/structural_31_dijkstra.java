import java.util.*;
public class Dijk_6 {
    public static void main(String[] args) {
        Dijk_6 da = new Dijk_6();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_6(g, 0);
    }
    public int ext_6(int[] d_6, boolean[] vis_6, int nv_6) {
        int sv_6 = -1;
        int cmin_6 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_6; v++) {
            if (!vis_6[v] && d_6[v] <= cmin_6) {
                cmin_6 = d_6[v];
                sv_6 = v;
            }
        }
        return sv_6;
    }
    public int[] dist_6(int[][] gm_6, int src_6) {
        int nv_6 = gm_6.length;
        int[] d_6 = new int[nv_6];
        boolean[] vis_6 = new boolean[nv_6];
        for (int i = 0; i < nv_6; i++) {
            d_6[i] = Integer.MAX_VALUE;
            vis_6[i] = false;
        }
        d_6[src_6] = 0;
        int cnt_6 = 0;
        while (cnt_6 < nv_6 - 1) {
            int u = ext_6(d_6, vis_6, nv_6);
            if (u == -1) break;
            vis_6[u] = true;
            for (int v = 0; v < nv_6; v++) {
                if (!vis_6[v] && gm_6[u][v] != 0 && d_6[u] != Integer.MAX_VALUE && d_6[u] + gm_6[u][v] < d_6[v]) {
                    d_6[v] = d_6[u] + gm_6[u][v];
                }
            }
            cnt_6++;
        }
        return d_6;
    }
}