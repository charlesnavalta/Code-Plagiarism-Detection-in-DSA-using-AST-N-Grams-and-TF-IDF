public class Sorter_3 {
    public static void main(String[] args) {
        Sorter_3 hsc = new Sorter_3();
        int[] vals = {12, 11, 13, 5, 6, 7};
        hsc.sort_3(vals);
    }
    public void swp_3(int[] b_3, int p1_3, int p2_3) {
        int tmp_3 = b_3[p1_3];
        b_3[p1_3] = b_3[p2_3];
        b_3[p2_3] = tmp_3;
    }
    public void sift_3(int[] b_3, int len_3, int idx_3) {
        int rc_3 = 2 * idx_3 + 2;
        int lc_3 = 2 * idx_3 + 1;
        int max_p_3 = idx_3;
        if (rc_3 < len_3 && b_3[rc_3] > b_3[max_p_3]) {
            max_p_3 = rc_3;
        }
        if (lc_3 < len_3 && b_3[lc_3] > b_3[max_p_3]) {
            max_p_3 = lc_3;
        }
        if (max_p_3 != idx_3) {
            swp_3(b_3, idx_3, max_p_3);
            sift_3(b_3, len_3, max_p_3);
        }
    }
    public void sort_3(int[] b_3) {
        int len_3 = b_3.length;
        for (int k_3 = len_3 / 2 - 1; k_3 >= 0; k_3--) {
            sift_3(b_3, len_3, k_3);
        }
        for (int k_3 = len_3 - 1; k_3 > 0; k_3--) {
            swp_3(b_3, k_3, 0);
            sift_3(b_3, k_3, 0);
        }
    }
}