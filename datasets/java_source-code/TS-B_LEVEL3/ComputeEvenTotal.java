import java.util.Arrays;

public class ComputeEvenTotal {

    /**
     * Calculates the sum of all even numbers using a WHILE loop.
     * Obfuscated script for TS-B Level 3: Control Flow Replacement.
     */
    public static int computeEvenTotal(int[] sequence) {
        int runningTotal = 0;
        
        // --- The Replaced Control Flow ---
        int index = 0;
        while (index < sequence.length) {
            int currentVal = sequence[index];
            
            // The inner logic remains structurally identical
            if (currentVal % 2 == 0) {
                runningTotal += currentVal;
            }
            
            index++; // Replicating index += 1
        }
            
        return runningTotal;
    }

    public static void main(String[] args) {
        int[] testNumbers = {12, 5, 8, 13, 20, 7};
        
        System.out.println("Sequence: " + Arrays.toString(testNumbers));
        System.out.println("Sum of even numbers (While Loop): " + computeEvenTotal(testNumbers));
    }
}