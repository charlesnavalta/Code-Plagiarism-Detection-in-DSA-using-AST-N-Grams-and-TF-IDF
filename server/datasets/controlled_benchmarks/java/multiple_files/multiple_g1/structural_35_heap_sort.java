public class Sorter_10 {
    public static void main(String[] args) {
        int[] vals = {12, 11, 13, 5, 6, 7};
        new Sorter_10().sort(vals);
    }
    public void swap(int[] arr, int i, int j) {
        int t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
    public void sort(int[] vals) {
        int n = vals.length;
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(vals, n, i);
        }
        int last = n - 1;
        while (last > 0) {
            swap(vals, 0, last);
            heapify(vals, last, 0);
            last--;
        }
    }
    public void heapify(int[] vals, int n, int i) {
        int m = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        if (l < n && vals[l] > vals[m]) m = l;
        if (r < n && vals[r] > vals[m]) m = r;
        if (m != i) {
            swap(vals, i, m);
            heapify(vals, n, m);
        }
    }
}
