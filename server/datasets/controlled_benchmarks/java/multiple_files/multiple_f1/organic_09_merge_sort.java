// Organic MergeSort Student Submission 09
public class NaturalMergeSort {
    public static void sort(int[] arr) {
        if (arr.length <= 1) return;
        boolean sorted = false;
        int[] aux = new int[arr.length];
        while (!sorted) {
            sorted = true;
            int lo = 0;
            while (lo < arr.length) {
                int mid = lo;
                while (mid < arr.length - 1 && arr[mid] <= arr[mid + 1]) mid++;
                if (mid == arr.length - 1 && lo == 0) return;
                int hi = mid + 1;
                while (hi < arr.length - 1 && arr[hi] <= arr[hi + 1]) hi++;
                if (mid < arr.length - 1) {
                    merge(arr, aux, lo, mid, Math.min(hi, arr.length - 1));
                    sorted = false;
                }
                lo = hi + 1;
            }
        }
    }
    private static void merge(int[] a, int[] aux, int lo, int mid, int hi) {
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) aux[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
        while (i <= mid) aux[k++] = a[i++];
        while (j <= hi) aux[k++] = a[j++];
        for (int p = lo; p <= hi; p++) a[p] = aux[p];
    }
}
