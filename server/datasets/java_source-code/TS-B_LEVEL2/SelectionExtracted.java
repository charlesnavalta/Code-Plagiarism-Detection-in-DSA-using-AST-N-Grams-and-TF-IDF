import java.util.Arrays;

public class SelectionExtracted {

    // The extracted helper method!
    public static int findMinimumIndex(int[] arr, int startIdx, int n) {
        int minIdx = startIdx;
        for (int j = startIdx + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        return minIdx;
    }

    public static int[] monolithicSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            // The monolithic block is replaced by a single function call
            int minIdx = findMinimumIndex(arr, i, n); 
            
            // Swap the found minimum element with the first element
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
        return arr;
    }

    public static void main(String[] args) {
        int[] sampleData = {64, 25, 12, 22, 11};
        // Adding the print statements so you can execute and test it just like the baseline
        System.out.println("Original array: " + Arrays.toString(sampleData));
        System.out.println("Sorted array: " + Arrays.toString(monolithicSort(sampleData)));
    }
}