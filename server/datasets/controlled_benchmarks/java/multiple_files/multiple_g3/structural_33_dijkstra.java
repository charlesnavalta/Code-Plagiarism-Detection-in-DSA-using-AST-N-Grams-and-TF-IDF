import java.util.*;
public class Dijk_8 {
    public static void main(String[] args) {
        Dijk_8 da = new Dijk_8();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_8(g, 0);
    }
    public int ext_8(int[] d_8, boolean[] vis_8, int nv_8) {
        int sv_8 = -1;
        int cmin_8 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_8; v++) {
            if (!vis_8[v] && d_8[v] <= cmin_8) {
                cmin_8 = d_8[v];
                sv_8 = v;
            }
        }
        return sv_8;
    }
    public int[] dist_8(int[][] gm_8, int src_8) {
        int nv_8 = gm_8.length;
        int[] d_8 = new int[nv_8];
        boolean[] vis_8 = new boolean[nv_8];
        for (int i = 0; i < nv_8; i++) {
            d_8[i] = Integer.MAX_VALUE;
            vis_8[i] = false;
        }
        d_8[src_8] = 0;
        int cnt_8 = 0;
        while (cnt_8 < nv_8 - 1) {
            int u = ext_8(d_8, vis_8, nv_8);
            if (u == -1) break;
            vis_8[u] = true;
            for (int v = 0; v < nv_8; v++) {
                if (!vis_8[v] && gm_8[u][v] != 0 && d_8[u] != Integer.MAX_VALUE && d_8[u] + gm_8[u][v] < d_8[v]) {
                    d_8[v] = d_8[u] + gm_8[u][v];
                }
            }
            cnt_8++;
        }
        return d_8;
    }
}