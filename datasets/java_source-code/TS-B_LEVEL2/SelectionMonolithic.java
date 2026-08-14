import java.util.Arrays;

public class SelectionMonolithic {

    /**
     * Sorts an array using a monolithic Selection Sort algorithm.
     * Baseline script for TS-B Level 2: Method Extraction.
     */
    public static int[] monolithicSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n; i++) {
            // --- BLOCK TO BE EXTRACTED ---
            // In the obfuscated version, this entire process of finding 
            // the minimum index will be moved to a separate helper function.
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // -----------------------------
            
            // Swap the found minimum element with the first element
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
        
        return arr;
    }

    public static void main(String[] args) {
        int[] sampleData = {64, 25, 12, 22, 11};
        System.out.println("Original array: " + Arrays.toString(sampleData));
        System.out.println("Sorted array: " + Arrays.toString(monolithicSort(sampleData)));
    }
}