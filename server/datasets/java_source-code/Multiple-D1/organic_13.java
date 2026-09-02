// Organic Student Submission 13
public class DutchNationalFlagSort {
    public static void sort3Way(int[] a, int lo, int hi) {
        if (hi <= lo) return;
        int lt = lo, gt = hi;
        int v = a[lo];
        int i = lo + 1;
        while (i <= gt) {
            if (a[i] < v) {
                int t = a[lt]; a[lt] = a[i]; a[i] = t;
                lt++; i++;
            } else if (a[i] > v) {
                int t = a[i]; a[i] = a[gt]; a[gt] = t;
                gt--;
            } else {
                i++;
            }
        }
        sort3Way(a, lo, lt - 1);
        sort3Way(a, gt + 1, hi);
    }
}
