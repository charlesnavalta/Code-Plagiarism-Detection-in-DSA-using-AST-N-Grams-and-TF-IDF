import java.util.ArrayList;
import java.util.List;

public class FibonacciReordered {

    /**
     * Generates a Fibonacci sequence up to 'n' terms.
     * Obfuscated script for TS-B Level 1: Statement Reordering.
     */
    public static List<Integer> generateFibonacci(int n) {
        if (n <= 0) {
            return new ArrayList<>();
        }
        if (n == 1) {
            List<Integer> singleElementList = new ArrayList<>();
            singleElementList.add(0);
            return singleElementList;
        }

        // --- INDEPENDENT ASSIGNMENTS (REORDERED) ---
        // These statements have been swapped to alter the AST sequence
        int secondTerm = 1;
        int firstTerm = 0;

        List<Integer> sequence = new ArrayList<>();
        sequence.add(firstTerm);
        sequence.add(secondTerm);

        for (int i = 2; i < n; i++) {
            int nextTerm = firstTerm + secondTerm;
            sequence.add(nextTerm); 

            // Update terms for the next iteration
            firstTerm = secondTerm;
            secondTerm = nextTerm;
        }

        return sequence;
    }

    public static void main(String[] args) {
        int numTerms = 10;
        
        System.out.println("Fibonacci sequence up to " + numTerms + " terms:");
        System.out.println(generateFibonacci(numTerms));
    }
}