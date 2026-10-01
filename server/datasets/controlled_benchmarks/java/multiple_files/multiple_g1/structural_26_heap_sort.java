public class Sorter_1 {
    public static void main(String[] args) {
        int[] d = {12, 11, 13, 5, 6, 7};
        new Sorter_1().heapSort(d);
    }
    public void siftDown(int[] arr, int size, int root) {
        int best = root;
        int l = 2 * root + 1;
        int r = l + 1;
        if (l < size && arr[l] > arr[best]) best = l;
        if (r < size && arr[r] > arr[best]) best = r;
        if (best != root) {
            int t = arr[root];
            arr[root] = arr[best];
            arr[best] = t;
            siftDown(arr, size, best);
        }
    }
    public void heapSort(int[] arr) {
        int count = arr.length;
        int start = (count / 2) - 1;
        while (start >= 0) {
            siftDown(arr, count, start);
            start--;
        }
        for (int end = count - 1; end > 0; end--) {
            int t = arr[0];
            arr[0] = arr[end];
            arr[end] = t;
            siftDown(arr, end, 0);
        }
    }
}
