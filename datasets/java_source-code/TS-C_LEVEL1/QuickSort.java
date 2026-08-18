import java.util.Arrays;

public class QuickSort {

    public static int[] quickSort(int[] arr) {
        // Base case: if array is size 0 or 1, it is already sorted
        if (arr.length <= 1) {
            return arr;
        }

        // Pivot selection (middle element)
        int pivot = arr[arr.length / 2];
        
        // Temporary arrays to hold elements before we know their exact final count
        int[] leftTemp = new int[arr.length];
        int[] middleTemp = new int[arr.length];
        int[] rightTemp = new int[arr.length];
        
        int leftCount = 0;
        int middleCount = 0;
        int rightCount = 0;

        // Replicating the three list comprehensions in a single pass
        for (int x : arr) {
            if (x < pivot) {
                leftTemp[leftCount++] = x;
            } else if (x == pivot) {
                middleTemp[middleCount++] = x;
            } else {
                rightTemp[rightCount++] = x;
            }
        }

        // Recursively sort the left and right sub-arrays
        int[] leftSorted = quickSort(Arrays.copyOf(leftTemp, leftCount));
        int[] rightSorted = quickSort(Arrays.copyOf(rightTemp, rightCount));
        
        // The middle array contains duplicates of the pivot; it doesn't need sorting
        int[] middle = Arrays.copyOf(middleTemp, middleCount);

        // Replicating Python's return statement: left + middle + right
        int[] result = new int[leftSorted.length + middle.length + rightSorted.length];
        
        // Copy left array into the result
        System.arraycopy(leftSorted, 0, result, 0, leftSorted.length);
        
        // Copy middle array into the result
        System.arraycopy(middle, 0, result, leftSorted.length, middle.length);
        
        // Copy right array into the result
        System.arraycopy(rightSorted, 0, result, leftSorted.length + middle.length, rightSorted.length);

        return result;
    }

    public static void main(String[] args) {
        // Test the implementation
        int[] data = {3, 6, 8, 10, 1, 2, 1};
        System.out.println(Arrays.toString(quickSort(data)));
    }
}