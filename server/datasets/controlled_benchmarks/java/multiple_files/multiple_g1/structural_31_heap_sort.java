public class Sorter_6 {
    public static void main(String[] args) {
        Sorter_6 hsc = new Sorter_6();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_6(vals);
    }
    public void swp_6(int[] b_6, int p1_6, int p2_6) {
        int tmp_6 = b_6[p1_6];
        b_6[p1_6] = b_6[p2_6];
        b_6[p2_6] = tmp_6;
    }
    public void sift_6(int[] b_6, int len_6, int idx_6) {
        int rc_6 = 2 * idx_6 + 2;
        int lc_6 = 2 * idx_6 + 1;
        int max_p_6 = idx_6;
        if (rc_6 < len_6 && b_6[rc_6] > b_6[max_p_6]) {
            max_p_6 = rc_6;
        }
        if (lc_6 < len_6 && b_6[lc_6] > b_6[max_p_6]) {
            max_p_6 = lc_6;
        }
        if (max_p_6 != idx_6) {
            swp_6(b_6, idx_6, max_p_6);
            sift_6(b_6, len_6, max_p_6);
        }
    }
    public void sort_6(int[] b_6) {
        int len_6 = b_6.length;
        for (int k_6 = len_6 / 2 - 1; k_6 >= 0; k_6--) {
            sift_6(b_6, len_6, k_6);
        }
        for (int k_6 = len_6 - 1; k_6 > 0; k_6--) {
            swp_6(b_6, k_6, 0);
            sift_6(b_6, k_6, 0);
        }
    }
}