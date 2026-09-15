public class Sorter_8 {
    public static void main(String[] args) {
        Sorter_8 hsc = new Sorter_8();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_8(vals);
    }
    public void swp_8(int[] b_8, int p1_8, int p2_8) {
        int tmp_8 = b_8[p1_8];
        b_8[p1_8] = b_8[p2_8];
        b_8[p2_8] = tmp_8;
    }
    public void sift_8(int[] b_8, int len_8, int idx_8) {
        int rc_8 = 2 * idx_8 + 2;
        int lc_8 = 2 * idx_8 + 1;
        int max_p_8 = idx_8;
        if (rc_8 < len_8 && b_8[rc_8] > b_8[max_p_8]) {
            max_p_8 = rc_8;
        }
        if (lc_8 < len_8 && b_8[lc_8] > b_8[max_p_8]) {
            max_p_8 = lc_8;
        }
        if (max_p_8 != idx_8) {
            swp_8(b_8, idx_8, max_p_8);
            sift_8(b_8, len_8, max_p_8);
        }
    }
    public void sort_8(int[] b_8) {
        int len_8 = b_8.length;
        for (int k_8 = len_8 / 2 - 1; k_8 >= 0; k_8--) {
            sift_8(b_8, len_8, k_8);
        }
        for (int k_8 = len_8 - 1; k_8 > 0; k_8--) {
            swp_8(b_8, k_8, 0);
            sift_8(b_8, k_8, 0);
        }
    }
}