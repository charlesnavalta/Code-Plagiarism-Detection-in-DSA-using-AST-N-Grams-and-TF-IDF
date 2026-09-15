import java.util.*;
public class Dijk_4 {
    public static void main(String[] args) {
        Dijk_4 da = new Dijk_4();
        int[][] g = {{0, 4}, {4, 0}};
        da.dist_4(g, 0);
    }
    public int ext_4(int[] d_4, boolean[] vis_4, int nv_4) {
        int sv_4 = -1;
        int cmin_4 = Integer.MAX_VALUE;
        for (int v = 0; v < nv_4; v++) {
            if (!vis_4[v] && d_4[v] <= cmin_4) {
                cmin_4 = d_4[v];
                sv_4 = v;
            }
        }
        return sv_4;
    }
    public int[] dist_4(int[][] gm_4, int src_4) {
        int nv_4 = gm_4.length;
        int[] d_4 = new int[nv_4];
        boolean[] vis_4 = new boolean[nv_4];
        for (int i = 0; i < nv_4; i++) {
            d_4[i] = Integer.MAX_VALUE;
            vis_4[i] = false;
        }
        d_4[src_4] = 0;
        int cnt_4 = 0;
        while (cnt_4 < nv_4 - 1) {
            int u = ext_4(d_4, vis_4, nv_4);
            if (u == -1) break;
            vis_4[u] = true;
            for (int v = 0; v < nv_4; v++) {
                if (!vis_4[v] && gm_4[u][v] != 0 && d_4[u] != Integer.MAX_VALUE && d_4[u] + gm_4[u][v] < d_4[v]) {
                    d_4[v] = d_4[u] + gm_4[u][v];
                }
            }
            cnt_4++;
        }
        return d_4;
    }
}