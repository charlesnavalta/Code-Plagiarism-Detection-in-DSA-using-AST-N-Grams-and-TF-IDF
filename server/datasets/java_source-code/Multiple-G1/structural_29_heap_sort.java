public class Sorter_4 {
    public static void main(String[] args) {
        Sorter_4 hsc = new Sorter_4();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_4(vals);
    }
    public void swp_4(int[] b_4, int p1_4, int p2_4) {
        int tmp_4 = b_4[p1_4];
        b_4[p1_4] = b_4[p2_4];
        b_4[p2_4] = tmp_4;
    }
    public void sift_4(int[] b_4, int len_4, int idx_4) {
        int rc_4 = 2 * idx_4 + 2;
        int lc_4 = 2 * idx_4 + 1;
        int max_p_4 = idx_4;
        if (rc_4 < len_4 && b_4[rc_4] > b_4[max_p_4]) {
            max_p_4 = rc_4;
        }
        if (lc_4 < len_4 && b_4[lc_4] > b_4[max_p_4]) {
            max_p_4 = lc_4;
        }
        if (max_p_4 != idx_4) {
            swp_4(b_4, idx_4, max_p_4);
            sift_4(b_4, len_4, max_p_4);
        }
    }
    public void sort_4(int[] b_4) {
        int len_4 = b_4.length;
        for (int k_4 = len_4 / 2 - 1; k_4 >= 0; k_4--) {
            sift_4(b_4, len_4, k_4);
        }
        for (int k_4 = len_4 - 1; k_4 > 0; k_4--) {
            swp_4(b_4, k_4, 0);
            sift_4(b_4, k_4, 0);
        }
    }
}