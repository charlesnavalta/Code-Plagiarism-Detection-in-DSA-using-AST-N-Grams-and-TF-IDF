// QuickSort Suite: In-place Lomuto partition with Median-of-Three pivot selection
// Author: Mary (organic_1.java)
public class QuickSortSuite {
    private int[] data;
    private int comparisons;
    private int swaps;

    public QuickSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
        this.comparisons = 0;
        this.swaps = 0;
    }

    private int medianOfThree(int[] arr, int low, int high) {
        int mid = low + (high - low) / 2;
        int a = arr[low], b = arr[mid], c = arr[high];
        if ((a <= b && b <= c) || (c <= b && b <= a)) return mid;
        if ((b <= a && a <= c) || (c <= a && a <= b)) return low;
        return high;
    }

    private int partition(int[] arr, int low, int high) {
        int pivotIdx = medianOfThree(arr, low, high);
        int temp = arr[pivotIdx];
        arr[pivotIdx] = arr[high];
        arr[high] = temp;
        this.swaps++;
        
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            this.comparisons++;
            if (arr[j] <= pivot) {
                i++;
                int t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
                this.swaps++;
            }
        }
        int t2 = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = t2;
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

    public int[] sort(boolean inPlace) {
        int[] target = inPlace ? this.data : this.data.clone();
        if (target.length > 1) {
            quicksortRecursive(target, 0, target.length - 1);
        }
        return target;
    }

    public boolean isSorted() {
        for (int k = 0; k < this.data.length - 1; k++) {
            if (this.data[k] > this.data[k + 1]) return false;
        }
        return true;
    }
}
