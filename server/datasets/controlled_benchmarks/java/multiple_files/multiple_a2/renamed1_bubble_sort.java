/*
 * Bubble Sort - renamed1
 * Approach: Same underlying design as unique1, but every class name,
 * method name, variable name, and comment has been changed.
 */

import java.util.Arrays;

class ArraySorterUtility {
    int[] values;
    int exchangeCount;
    int roundCount;

    public ArraySorterUtility(int[] values) {
        this.values = Arrays.copyOf(values, values.length);
        this.exchangeCount = 0;
        this.roundCount = 0;
    }

    public int[] process() {
        int length = this.values.length;
        for (int outerIndex = 0; outerIndex < length - 1; outerIndex++) {
            this.roundCount++;
            boolean didExchange = false;
            for (int innerIndex = 0; innerIndex < length - 1 - outerIndex; innerIndex++) {
                if (this.values[innerIndex] > this.values[innerIndex + 1]) {
                    int replacement = this.values[innerIndex];
                    this.values[innerIndex] = this.values[innerIndex + 1];
                    this.values[innerIndex + 1] = replacement;
                    this.exchangeCount++;
                    didExchange = true;
                }
            }
            if (!didExchange) {
                break;
            }
        }
        return this.values;
    }

    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        ArraySorterUtility utility = new ArraySorterUtility(numbers);
        int[] output = utility.process();
        System.out.println("Sorted: " + Arrays.toString(output));
        System.out.println("Swaps: " + utility.exchangeCount + ", Passes: " + utility.roundCount);
    }
}
