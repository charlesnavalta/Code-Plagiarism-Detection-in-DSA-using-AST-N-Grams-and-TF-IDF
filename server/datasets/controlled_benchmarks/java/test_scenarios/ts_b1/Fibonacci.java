import java.util.ArrayList;
import java.util.List;

public class Fibonacci {

    /**
     * Generates a Fibonacci sequence up to 'n' terms.
     * Baseline script for TS-B Level 1: Statement Reordering.
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

        // --- INDEPENDENT ASSIGNMENTS ---
        // These are the statements that will be swapped in the obfuscated version
        int firstTerm = 0;
        int secondTerm = 1;

        List<Integer> sequence = new ArrayList<>();
        sequence.add(firstTerm);
        sequence.add(secondTerm);

        for (int i = 2; i < n; i++) {
            int nextTerm = firstTerm + secondTerm;
            sequence.add(nextTerm); // Replicating sequence.append()

            // Update terms for the next iteration
            firstTerm = secondTerm;
            secondTerm = nextTerm;
        }

        return sequence;
    }

    public static void main(String[] args) {
        int numTerms = 10;
        // Replicating the f-string print formatting
        System.out.println("Fibonacci sequence up to " + numTerms + " terms:");
        System.out.println(generateFibonacci(numTerms));
    }
}