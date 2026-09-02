// Organic Student Submission 12
public class HoareQuickSort {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[low];
        int i = low - 1, j = high + 1;
        while (true) {
            do { i++; } while (arr[i] < pivot);
            do { j--; } while (arr[j] > pivot);
            if (i >= j) return j;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int p = partition(arr, low, high);
            sort(arr, low, p);
            sort(arr, p + 1, high);
        }
    }
}
