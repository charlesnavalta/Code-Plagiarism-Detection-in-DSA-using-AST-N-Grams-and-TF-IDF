public class Sorter_5 {
    public static void main(String[] args) {
        Sorter_5 hsc = new Sorter_5();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_5(vals);
    }
    public void swp_5(int[] b_5, int p1_5, int p2_5) {
        int tmp_5 = b_5[p1_5];
        b_5[p1_5] = b_5[p2_5];
        b_5[p2_5] = tmp_5;
    }
    public void sift_5(int[] b_5, int len_5, int idx_5) {
        int rc_5 = 2 * idx_5 + 2;
        int lc_5 = 2 * idx_5 + 1;
        int max_p_5 = idx_5;
        if (rc_5 < len_5 && b_5[rc_5] > b_5[max_p_5]) {
            max_p_5 = rc_5;
        }
        if (lc_5 < len_5 && b_5[lc_5] > b_5[max_p_5]) {
            max_p_5 = lc_5;
        }
        if (max_p_5 != idx_5) {
            swp_5(b_5, idx_5, max_p_5);
            sift_5(b_5, len_5, max_p_5);
        }
    }
    public void sort_5(int[] b_5) {
        int len_5 = b_5.length;
        for (int k_5 = len_5 / 2 - 1; k_5 >= 0; k_5--) {
            sift_5(b_5, len_5, k_5);
        }
        for (int k_5 = len_5 - 1; k_5 > 0; k_5--) {
            swp_5(b_5, k_5, 0);
            sift_5(b_5, k_5, 0);
        }
    }
}