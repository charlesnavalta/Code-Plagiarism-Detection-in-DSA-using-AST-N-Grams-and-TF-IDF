import java.util.Arrays;

public class QuickSortRenamed {

    public static int[] fastSort(int[] sequence) {
        // Base case: if sequence is size 0 or 1, it is already sorted
        if (sequence.length <= 1) {
            return sequence;
        }

        // Replicating divider = sequence[-1]
        int divider = sequence[sequence.length - 1];
        
        // Temporary arrays to hold items before knowing their final count
        int[] smallerItemsTemp = new int[sequence.length];
        int[] largerItemsTemp = new int[sequence.length];
        int smallerCount = 0;
        int largerCount = 0;

        // Iterate through all items except the divider at the end
        for (int index = 0; index < sequence.length - 1; index++) {
            if (sequence[index] <= divider) {
                smallerItemsTemp[smallerCount++] = sequence[index]; 
            } else {
                largerItemsTemp[largerCount++] = sequence[index]; 
            }
        }

        // Recursively sort the correctly sized sub-arrays
        int[] smallerItems = fastSort(Arrays.copyOf(smallerItemsTemp, smallerCount));
        int[] largerItems = fastSort(Arrays.copyOf(largerItemsTemp, largerCount));

        // Replicating smaller_items + [divider] + larger_items
        int[] result = new int[smallerItems.length + 1 + largerItems.length];
        
        // Assemble the final array
        System.arraycopy(smallerItems, 0, result, 0, smallerItems.length);
        result[smallerItems.length] = divider;
        System.arraycopy(largerItems, 0, result, smallerItems.length + 1, largerItems.length);

        return result;
    }

    public static void main(String[] args) {
        int[] sampleNumbers = {10, 7, 8, 9, 1, 5};
        int[] sortedNumbers = fastSort(sampleNumbers);
        
        System.out.println(Arrays.toString(sortedNumbers));
    }
}