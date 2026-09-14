public class Sorter_7 {
    public static void main(String[] args) {
        Sorter_7 hsc = new Sorter_7();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_7(vals);
    }
    public void swp_7(int[] b_7, int p1_7, int p2_7) {
        int tmp_7 = b_7[p1_7];
        b_7[p1_7] = b_7[p2_7];
        b_7[p2_7] = tmp_7;
    }
    public void sift_7(int[] b_7, int len_7, int idx_7) {
        int rc_7 = 2 * idx_7 + 2;
        int lc_7 = 2 * idx_7 + 1;
        int max_p_7 = idx_7;
        if (rc_7 < len_7 && b_7[rc_7] > b_7[max_p_7]) {
            max_p_7 = rc_7;
        }
        if (lc_7 < len_7 && b_7[lc_7] > b_7[max_p_7]) {
            max_p_7 = lc_7;
        }
        if (max_p_7 != idx_7) {
            swp_7(b_7, idx_7, max_p_7);
            sift_7(b_7, len_7, max_p_7);
        }
    }
    public void sort_7(int[] b_7) {
        int len_7 = b_7.length;
        for (int k_7 = len_7 / 2 - 1; k_7 >= 0; k_7--) {
            sift_7(b_7, len_7, k_7);
        }
        for (int k_7 = len_7 - 1; k_7 > 0; k_7--) {
            swp_7(b_7, k_7, 0);
            sift_7(b_7, k_7, 0);
        }
    }
}