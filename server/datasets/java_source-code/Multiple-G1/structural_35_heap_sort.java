public class Sorter_10 {
    public static void main(String[] args) {
        Sorter_10 hsc = new Sorter_10();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_10(vals);
    }
    public void swp_10(int[] b_10, int p1_10, int p2_10) {
        int tmp_10 = b_10[p1_10];
        b_10[p1_10] = b_10[p2_10];
        b_10[p2_10] = tmp_10;
    }
    public void sift_10(int[] b_10, int len_10, int idx_10) {
        int rc_10 = 2 * idx_10 + 2;
        int lc_10 = 2 * idx_10 + 1;
        int max_p_10 = idx_10;
        if (rc_10 < len_10 && b_10[rc_10] > b_10[max_p_10]) {
            max_p_10 = rc_10;
        }
        if (lc_10 < len_10 && b_10[lc_10] > b_10[max_p_10]) {
            max_p_10 = lc_10;
        }
        if (max_p_10 != idx_10) {
            swp_10(b_10, idx_10, max_p_10);
            sift_10(b_10, len_10, max_p_10);
        }
    }
    public void sort_10(int[] b_10) {
        int len_10 = b_10.length;
        for (int k_10 = len_10 / 2 - 1; k_10 >= 0; k_10--) {
            sift_10(b_10, len_10, k_10);
        }
        for (int k_10 = len_10 - 1; k_10 > 0; k_10--) {
            swp_10(b_10, k_10, 0);
            sift_10(b_10, k_10, 0);
        }
    }
}