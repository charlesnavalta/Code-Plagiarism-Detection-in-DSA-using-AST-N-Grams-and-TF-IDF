// MergeSort Suite: Structural Method Restructuring
// Author: Structural Variant (Type 3 of Mary)
public class MergeSortSuite {
    private int[] data;

    public MergeSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
    }

    public static int[] mergeHelper(int[] a, int[] b) {
        int[] out = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        }
        while (i < a.length) out[k++] = a[i++];
        while (j < b.length) out[k++] = b[j++];
        return out;
    }

    public boolean isSorted() {
        for (int i = 0; i < this.data.length - 1; i++) {
            if (this.data[i] > this.data[i + 1]) return false;
        }
        return true;
    }

    public int[] executeSort() {
        if (this.data.length > 1) this.data = sortRecursive(this.data);
        return this.data;
    }

    private int[] sortRecursive(int[] arr) {
        if (arr.length <= 1) return arr;
        int m = arr.length / 2;
        int[] l = new int[m], r = new int[arr.length - m];
        System.arraycopy(arr, 0, l, 0, m);
        System.arraycopy(arr, m, r, 0, arr.length - m);
        return mergeHelper(sortRecursive(l), sortRecursive(r));
    }
}
