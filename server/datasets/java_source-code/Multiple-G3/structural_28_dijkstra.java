import java.util.*;
public class Dijk_3 {
    public static void main(String[] args) {
        Dijk_3 da = new Dijk_3();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_3(g, 0);
    }
    public int ext_3(int[] d_3, boolean[] vis_3, int nv_3) {
        int sv_3 = -1;
        int cmin_3 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_3; v++) {
            if (!vis_3[v] && d_3[v] <= cmin_3) {
                cmin_3 = d_3[v];
                sv_3 = v;
            }
        }
        return sv_3;
    }
    public int[] dist_3(int[][] gm_3, int src_3) {
        int nv_3 = gm_3.length;
        int[] d_3 = new int[nv_3];
        boolean[] vis_3 = new boolean[nv_3];
        for (int i = 0; i < nv_3; i++) {
            d_3[i] = Integer.MAX_VALUE;
            vis_3[i] = false;
        }
        d_3[src_3] = 0;
        int cnt_3 = 0;
        while (cnt_3 < nv_3 - 1) {
            int u = ext_3(d_3, vis_3, nv_3);
            if (u == -1) break;
            vis_3[u] = true;
            for (int v = 0; v < nv_3; v++) {
                if (!vis_3[v] && gm_3[u][v] != 0 && d_3[u] != Integer.MAX_VALUE && d_3[u] + gm_3[u][v] < d_3[v]) {
                    d_3[v] = d_3[u] + gm_3[u][v];
                }
            }
            cnt_3++;
        }
        return d_3;
    }
}