public class Sorter_6 {
    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6, 7};
        new Sorter_6().sortArray(arr);
    }
    public void sortArray(int[] arr) {
        int len = arr.length;
        buildHeap(arr, len);
        int end = len - 1;
        while (end > 0) {
            swap(arr, 0, end);
            sift(arr, end, 0);
            end--;
        }
    }
    public void buildHeap(int[] arr, int len) {
        for (int i = (len - 2) / 2; i >= 0; i--) {
            sift(arr, len, i);
        }
    }
    public void swap(int[] arr, int x, int y) {
        int temp = arr[x];
        arr[x] = arr[y];
        arr[y] = temp;
    }
    public void sift(int[] arr, int n, int i) {
        int top = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        if (l < n && arr[l] > arr[top]) top = l;
        if (r < n && arr[r] > arr[top]) top = r;
        if (top != i) {
            swap(arr, i, top);
            sift(arr, n, top);
        }
    }
}
