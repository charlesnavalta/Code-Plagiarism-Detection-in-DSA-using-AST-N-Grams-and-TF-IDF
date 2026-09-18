public class Sorter_0 {
    public static void main(String[] args) {
        Sorter_0 hsc = new Sorter_0();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_0(vals);
    }
    public void swp_0(int[] b_0, int p1_0, int p2_0) {
        int tmp_0 = b_0[p1_0];
        b_0[p1_0] = b_0[p2_0];
        b_0[p2_0] = tmp_0;
    }
    public void sift_0(int[] b_0, int len_0, int idx_0) {
        int rc_0 = 2 * idx_0 + 2;
        int lc_0 = 2 * idx_0 + 1;
        int max_p_0 = idx_0;
        if (rc_0 < len_0 && b_0[rc_0] > b_0[max_p_0]) {
            max_p_0 = rc_0;
        }
        if (lc_0 < len_0 && b_0[lc_0] > b_0[max_p_0]) {
            max_p_0 = lc_0;
        }
        if (max_p_0 != idx_0) {
            swp_0(b_0, idx_0, max_p_0);
            sift_0(b_0, len_0, max_p_0);
        }
    }
    public void sort_0(int[] b_0) {
        int len_0 = b_0.length;
        for (int k_0 = len_0 / 2 - 1; k_0 >= 0; k_0--) {
            sift_0(b_0, len_0, k_0);
        }
        for (int k_0 = len_0 - 1; k_0 > 0; k_0--) {
            swp_0(b_0, k_0, 0);
            sift_0(b_0, k_0, 0);
        }
    }
}