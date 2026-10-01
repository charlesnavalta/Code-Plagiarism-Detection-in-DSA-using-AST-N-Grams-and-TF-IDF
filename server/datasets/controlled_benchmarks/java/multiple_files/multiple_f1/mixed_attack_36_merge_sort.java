public class MergeSortSuite {
    private int[] data;
    private long inversions;
    private boolean sortedState;

    public MergeSortSuite(int[] rawData) {
        this.data = (rawData != null) ? rawData.clone() : new int[0];
        this.inversions = 0;
        this.sortedState = false;
    }

    public boolean isSorted() {
        for (int p = 0; p < this.data.length - 1; p++) {
            if (this.data[p] > this.data[p + 1]) return false;
        }
        return true;
    }

    public int[] executeSort() {
        if (this.data.length > 1) {
            this.data = sortRecursive(this.data);
            this.sortedState = true;
        }
        return this.data;
    }

    private int[] sortRecursive(int[] arr) {
        int sz = arr.length;
        if (sz <= 1) return arr;
        int mid = sz / 2;
        int[] leftSlice = new int[mid];
        int[] rightSlice = new int[sz - mid];
        System.arraycopy(arr, 0, leftSlice, 0, mid);
        System.arraycopy(arr, mid, rightSlice, 0, sz - mid);
        return merge(sortRecursive(leftSlice), sortRecursive(rightSlice));
    }

    private int[] merge(int[] l, int[] r) {
        int[] res = new int[l.length + r.length];
        int i = 0, j = 0, k = 0;
        while (i < l.length && j < r.length) {
            if (l[i] <= r[j]) {
                res[k++] = l[i++];
            } else {
                res[k++] = r[j++];
                this.inversions += (l.length - i);
            }
        }
        while (i < l.length) res[k++] = l[i++];
        while (j < r.length) res[k++] = r[j++];
        return res;
    }
}
