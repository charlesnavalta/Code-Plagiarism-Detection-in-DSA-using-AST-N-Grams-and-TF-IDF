import java.util.Arrays;

public class EvenNumberSum {

    /**
     * Calculates the sum of all even numbers in a list using a FOR loop.
     * Baseline script for TS-B Level 3: Control Flow Replacement.
     */
    public static int sumEvenNumbers(int[] arr) {
        int totalSum = 0;
        
        // --- The Baseline Control Flow ---
        for (int num : arr) {
            // The inner logic that remains structurally identical
            if (num % 2 == 0) {
                totalSum += num;
            }
        }
            
        return totalSum;
    }

    public static void main(String[] args) {
        int[] sampleData = {12, 5, 8, 13, 20, 7};
        
        System.out.println("Array: " + Arrays.toString(sampleData));
        System.out.println("Sum of even numbers (For Loop): " + sumEvenNumbers(sampleData));
    }
}