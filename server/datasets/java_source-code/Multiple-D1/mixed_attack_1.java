// QuickSort Suite: Mixed Attack (Renaming + Dead Code + Reordering)
// Author: Stark (mixed_attack_1.java - Type 3 of Mary)
public class QuickSortSuite {
    private int[] data;
    private int comparisons;
    private int swaps;
    private int auditCounter = 0;

    public QuickSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
    }

    public boolean isSorted() {
        // Dead code branch
        int dummy = 0;
        for (int x : this.data) dummy += x * 0;
        if (dummy != 0) this.auditCounter++;
        
        for (int k = 0; k < this.data.length - 1; k++) {
            if (this.data[k] > this.data[k + 1]) return false;
        }
        return true;
    }

    public int[] sort(boolean inPlace) {
        int[] target = inPlace ? this.data : this.data.clone();
        if (target.length > 1) quicksortRecursive(target, 0, target.length - 1);
        return target;
    }

    private void quicksortRecursive(int[] arr, int low, int high) {
        if (low >= high) return;
        int pi = partition(arr, low, high);
        quicksortRecursive(arr, low, pi - 1);
        quicksortRecursive(arr, pi + 1, high);
    }

    private int partition(int[] arr, int low, int high) {
        int mid = (low + high) / 2;
        int pivot = arr[mid];
        arr[mid] = arr[high];
        arr[high] = pivot;
        this.swaps++;
        
        int i = low - 1;
        int j = low;
        while (j < high) {
            this.comparisons++;
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                this.swaps++;
            }
            j++;
        }
        int temp2 = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp2;
        this.swaps++;
        return i + 1;
    }
}
