public class Sorter_9 {
    public static void main(String[] args) {
        Sorter_9 hsc = new Sorter_9();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_9(vals);
    }
    public void swp_9(int[] b_9, int p1_9, int p2_9) {
        int tmp_9 = b_9[p1_9];
        b_9[p1_9] = b_9[p2_9];
        b_9[p2_9] = tmp_9;
    }
    public void sift_9(int[] b_9, int len_9, int idx_9) {
        int rc_9 = 2 * idx_9 + 2;
        int lc_9 = 2 * idx_9 + 1;
        int max_p_9 = idx_9;
        if (rc_9 < len_9 && b_9[rc_9] > b_9[max_p_9]) {
            max_p_9 = rc_9;
        }
        if (lc_9 < len_9 && b_9[lc_9] > b_9[max_p_9]) {
            max_p_9 = lc_9;
        }
        if (max_p_9 != idx_9) {
            swp_9(b_9, idx_9, max_p_9);
            sift_9(b_9, len_9, max_p_9);
        }
    }
    public void sort_9(int[] b_9) {
        int len_9 = b_9.length;
        for (int k_9 = len_9 / 2 - 1; k_9 >= 0; k_9--) {
            sift_9(b_9, len_9, k_9);
        }
        for (int k_9 = len_9 - 1; k_9 > 0; k_9--) {
            swp_9(b_9, k_9, 0);
            sift_9(b_9, k_9, 0);
        }
    }
}