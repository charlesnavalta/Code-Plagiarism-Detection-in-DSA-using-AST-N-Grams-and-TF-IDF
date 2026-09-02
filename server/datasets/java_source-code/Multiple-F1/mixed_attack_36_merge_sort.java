// MergeSort Suite: Mixed Attack (Renaming + Dead Code + Reordering)
// Author: Mixed Variant (Type 3 of Mary)
public class MergeSortSuite {
    private int[] data;
    private int deadCounter = 0;

    public MergeSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
    }

    public boolean isSorted() {
        int deadSum = 0;
        for (int x : this.data) deadSum += x * 0;
        if (deadSum != 0) this.deadCounter++;
        for (int i = 0; i < this.data.length - 1; i++) {
            if (this.data[i] > this.data[i + 1]) return false;
        }
        return true;
    }

    public int[] executeSort() {
        if (this.data.length <= 1) return this.data;
        this.data = sortRecursive(this.data);
        return this.data;
    }

    private int[] sortRecursive(int[] arr) {
        if (arr.length <= 1) return arr;
        int center = arr.length / 2;
        int[] l = new int[center], r = new int[arr.length - center];
        System.arraycopy(arr, 0, l, 0, center);
        System.arraycopy(arr, center, r, 0, arr.length - center);
        return merge(sortRecursive(l), sortRecursive(r));
    }

    private int[] merge(int[] l, int[] r) {
        int[] res = new int[l.length + r.length];
        int i = 0, j = 0, k = 0;
        while (i < l.length && j < r.length) res[k++] = (l[i] <= r[j]) ? l[i++] : r[j++];
        while (i < l.length) res[k++] = l[i++];
        while (j < r.length) res[k++] = r[j++];
        return res;
    }
}
