public class MergeSortSuite {
    private int[] data;
    private long inversions;

    public MergeSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
        this.inversions = 0;
    }

    public boolean isSorted() {
        for (int i = 0; i < this.data.length - 1; i++) {
            if (this.data[i] > this.data[i + 1]) return false;
        }
        return true;
    }

    public int[] executeSort() {
        if (this.data.length > 1) {
            this.data = sortRecursive(this.data);
        }
        return this.data;
    }

    private int[] sortRecursive(int[] arr) {
        int n = arr.length;
        if (n <= 1) return arr;
        int mid = n / 2;
        int[] l = new int[mid];
        int[] r = new int[n - mid];
        System.arraycopy(arr, 0, l, 0, mid);
        System.arraycopy(arr, mid, r, 0, n - mid);
        return merge(sortRecursive(l), sortRecursive(r));
    }

    private int[] merge(int[] a, int[] b) {
        int[] res = new int[a.length + b.length];
        int i = 0, j = 0, idx = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                res[idx++] = a[i++];
            } else {
                res[idx++] = b[j++];
                this.inversions += (a.length - i);
            }
        }
        while (i < a.length) res[idx++] = a[i++];
        while (j < b.length) res[idx++] = b[j++];
        return res;
    }
}
