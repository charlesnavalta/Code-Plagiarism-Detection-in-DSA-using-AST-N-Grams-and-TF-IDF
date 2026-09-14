public class Sorter_1 {
    public static void main(String[] args) {
        Sorter_1 hsc = new Sorter_1();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_1(vals);
    }
    public void swp_1(int[] b_1, int p1_1, int p2_1) {
        int tmp_1 = b_1[p1_1];
        b_1[p1_1] = b_1[p2_1];
        b_1[p2_1] = tmp_1;
    }
    public void sift_1(int[] b_1, int len_1, int idx_1) {
        int rc_1 = 2 * idx_1 + 2;
        int lc_1 = 2 * idx_1 + 1;
        int max_p_1 = idx_1;
        if (rc_1 < len_1 && b_1[rc_1] > b_1[max_p_1]) {
            max_p_1 = rc_1;
        }
        if (lc_1 < len_1 && b_1[lc_1] > b_1[max_p_1]) {
            max_p_1 = lc_1;
        }
        if (max_p_1 != idx_1) {
            swp_1(b_1, idx_1, max_p_1);
            sift_1(b_1, len_1, max_p_1);
        }
    }
    public void sort_1(int[] b_1) {
        int len_1 = b_1.length;
        for (int k_1 = len_1 / 2 - 1; k_1 >= 0; k_1--) {
            sift_1(b_1, len_1, k_1);
        }
        for (int k_1 = len_1 - 1; k_1 > 0; k_1--) {
            swp_1(b_1, k_1, 0);
            sift_1(b_1, k_1, 0);
        }
    }
}