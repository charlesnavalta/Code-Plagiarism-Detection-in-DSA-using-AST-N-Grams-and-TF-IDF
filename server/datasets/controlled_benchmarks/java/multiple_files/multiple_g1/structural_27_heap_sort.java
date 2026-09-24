public class Sorter_2 {
    public static void main(String[] args) {
        Sorter_2 hsc = new Sorter_2();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_2(vals);
    }
    public void swp_2(int[] b_2, int p1_2, int p2_2) {
        int tmp_2 = b_2[p1_2];
        b_2[p1_2] = b_2[p2_2];
        b_2[p2_2] = tmp_2;
    }
    public void sift_2(int[] b_2, int len_2, int idx_2) {
        int rc_2 = 2 * idx_2 + 2;
        int lc_2 = 2 * idx_2 + 1;
        int max_p_2 = idx_2;
        if (rc_2 < len_2 && b_2[rc_2] > b_2[max_p_2]) {
            max_p_2 = rc_2;
        }
        if (lc_2 < len_2 && b_2[lc_2] > b_2[max_p_2]) {
            max_p_2 = lc_2;
        }
        if (max_p_2 != idx_2) {
            swp_2(b_2, idx_2, max_p_2);
            sift_2(b_2, len_2, max_p_2);
        }
    }
    public void sort_2(int[] b_2) {
        int len_2 = b_2.length;
        for (int k_2 = len_2 / 2 - 1; k_2 >= 0; k_2--) {
            sift_2(b_2, len_2, k_2);
        }
        for (int k_2 = len_2 - 1; k_2 > 0; k_2--) {
            swp_2(b_2, k_2, 0);
            sift_2(b_2, k_2, 0);
        }
    }
}