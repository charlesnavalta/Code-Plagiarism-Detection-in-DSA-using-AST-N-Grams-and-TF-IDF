// Organic Student Submission 15
public class HybridQuickSort {
    private static void insertionSort(int[] arr, int low, int high) {
        for (int i = low + 1; i <= high; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= low && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
    public static void sort(int[] arr, int low, int high) {
        if (high - low + 1 <= 10) {
            insertionSort(arr, low, high);
            return;
        }
        if (low < high) {
            int pivot = arr[high];
            int i = low - 1;
            for (int j = low; j < high; j++) {
                if (arr[j] <= pivot) {
                    i++;
                    int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
                }
            }
            int t2 = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = t2;
            int pi = i + 1;
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
}
