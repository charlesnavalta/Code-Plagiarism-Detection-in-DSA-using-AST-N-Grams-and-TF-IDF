import java.util.*;
public class Dijk_2 {
    public static void main(String[] args) {
        Dijk_2 da = new Dijk_2();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_2(g, 0);
    }
    public int ext_2(int[] d_2, boolean[] vis_2, int nv_2) {
        int sv_2 = -1;
        int cmin_2 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_2; v++) {
            if (!vis_2[v] && d_2[v] <= cmin_2) {
                cmin_2 = d_2[v];
                sv_2 = v;
            }
        }
        return sv_2;
    }
    public int[] dist_2(int[][] gm_2, int src_2) {
        int nv_2 = gm_2.length;
        int[] d_2 = new int[nv_2];
        boolean[] vis_2 = new boolean[nv_2];
        for (int i = 0; i < nv_2; i++) {
            d_2[i] = Integer.MAX_VALUE;
            vis_2[i] = false;
        }
        d_2[src_2] = 0;
        int cnt_2 = 0;
        while (cnt_2 < nv_2 - 1) {
            int u = ext_2(d_2, vis_2, nv_2);
            if (u == -1) break;
            vis_2[u] = true;
            for (int v = 0; v < nv_2; v++) {
                if (!vis_2[v] && gm_2[u][v] != 0 && d_2[u] != Integer.MAX_VALUE && d_2[u] + gm_2[u][v] < d_2[v]) {
                    d_2[v] = d_2[u] + gm_2[u][v];
                }
            }
            cnt_2++;
        }
        return d_2;
    }
}