import java.util.*;
public class Dijk_1 {
    public static void main(String[] args) {
        Dijk_1 da = new Dijk_1();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_1(g, 0);
    }
    public int ext_1(int[] d_1, boolean[] vis_1, int nv_1) {
        int sv_1 = -1;
        int cmin_1 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_1; v++) {
            if (!vis_1[v] && d_1[v] <= cmin_1) {
                cmin_1 = d_1[v];
                sv_1 = v;
            }
        }
        return sv_1;
    }
    public int[] dist_1(int[][] gm_1, int src_1) {
        int nv_1 = gm_1.length;
        int[] d_1 = new int[nv_1];
        boolean[] vis_1 = new boolean[nv_1];
        for (int i = 0; i < nv_1; i++) {
            d_1[i] = Integer.MAX_VALUE;
            vis_1[i] = false;
        }
        d_1[src_1] = 0;
        int cnt_1 = 0;
        while (cnt_1 < nv_1 - 1) {
            int u = ext_1(d_1, vis_1, nv_1);
            if (u == -1) break;
            vis_1[u] = true;
            for (int v = 0; v < nv_1; v++) {
                if (!vis_1[v] && gm_1[u][v] != 0 && d_1[u] != Integer.MAX_VALUE && d_1[u] + gm_1[u][v] < d_1[v]) {
                    d_1[v] = d_1[u] + gm_1[u][v];
                }
            }
            cnt_1++;
        }
        return d_1;
    }
}