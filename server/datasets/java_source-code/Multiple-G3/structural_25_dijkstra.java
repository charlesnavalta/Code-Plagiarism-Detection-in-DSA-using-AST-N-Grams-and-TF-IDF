import java.util.*;
public class Dijk_0 {
    public static void main(String[] args) {
        Dijk_0 da = new Dijk_0();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_0(g, 0);
    }
    public int ext_0(int[] d_0, boolean[] vis_0, int nv_0) {
        int sv_0 = -1;
        int cmin_0 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_0; v++) {
            if (!vis_0[v] && d_0[v] <= cmin_0) {
                cmin_0 = d_0[v];
                sv_0 = v;
            }
        }
        return sv_0;
    }
    public int[] dist_0(int[][] gm_0, int src_0) {
        int nv_0 = gm_0.length;
        int[] d_0 = new int[nv_0];
        boolean[] vis_0 = new boolean[nv_0];
        for (int i = 0; i < nv_0; i++) {
            d_0[i] = Integer.MAX_VALUE;
            vis_0[i] = false;
        }
        d_0[src_0] = 0;
        int cnt_0 = 0;
        while (cnt_0 < nv_0 - 1) {
            int u = ext_0(d_0, vis_0, nv_0);
            if (u == -1) break;
            vis_0[u] = true;
            for (int v = 0; v < nv_0; v++) {
                if (!vis_0[v] && gm_0[u][v] != 0 && d_0[u] != Integer.MAX_VALUE && d_0[u] + gm_0[u][v] < d_0[v]) {
                    d_0[v] = d_0[u] + gm_0[u][v];
                }
            }
            cnt_0++;
        }
        return d_0;
    }
}