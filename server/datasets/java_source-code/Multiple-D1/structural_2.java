// QuickSort Suite: Structural Method Extraction & Reordering
// Author: Hannah (structural_1.java - Type 3 of Mary)
public class QuickSortSuite {
    private int[] data;
    private int comparisons;
    private int swaps;

    public QuickSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
        this.comparisons = 0;
        this.swaps = 0;
    }

    private static void performSwap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public boolean isSorted() {
        int k = 0;
        while (k < this.data.length - 1) {
            if (this.data[k] > this.data[k + 1]) return false;
            k++;
        }
        return true;
    }

    public int[] sort(boolean inPlace) {
        int[] target = inPlace ? this.data : this.data.clone();
        if (target.length > 1) {
            quicksortRecursive(target, 0, target.length - 1);
        }
        return target;
    }

    private int partition(int[] arr, int low, int high) {
        int mid = (low + high) / 2;
        int pIdx = ((arr[low] <= arr[mid] && arr[mid] <= arr[high]) || (arr[high] <= arr[mid] && arr[mid] <= arr[low])) ? mid : low;
        performSwap(arr, pIdx, high);
        this.swaps++;
        
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            this.comparisons++;
            if (arr[j] <= pivot) {
                i++;
                performSwap(arr, i, j);
                this.swaps++;
            }
        }
        performSwap(arr, i + 1, high);
        this.swaps++;
        return i + 1;
    }

    private void quicksortRecursive(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quicksortRecursive(arr, low, pi - 1);
            quicksortRecursive(arr, pi + 1, high);
        }
    }
}
