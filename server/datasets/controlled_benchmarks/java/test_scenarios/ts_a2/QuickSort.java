import java.util.Arrays;

public class QuickSort {

    public static int[] quickSort(int[] arr) {
        // Base case: if array is size 0 or 1, it is already sorted
        if (arr.length <= 1) {
            return arr;
        }

        // Replicating Python's pivot = arr[-1] (the last element)
        int pivot = arr[arr.length - 1];
        
        // Temporary arrays to hold elements before we know their exact final count
        int[] leftTemp = new int[arr.length];
        int[] rightTemp = new int[arr.length];
        int leftCount = 0;
        int rightCount = 0;

        // Iterate through all elements except the last one (the pivot)
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] <= pivot) {
                leftTemp[leftCount++] = arr[i]; // Replicating left.append(arr[i])
            } else {
                rightTemp[rightCount++] = arr[i]; // Replicating right.append(arr[i])
            }
        }

        // Recursively sort the correctly sized sub-arrays
        int[] left = quickSort(Arrays.copyOf(leftTemp, leftCount));
        int[] right = quickSort(Arrays.copyOf(rightTemp, rightCount));

        // Replicating Python's return left + [pivot] + right
        int[] result = new int[left.length + 1 + right.length];
        
        // Copy left array into the result
        System.arraycopy(left, 0, result, 0, left.length);
        
        // Insert the pivot in the middle
        result[left.length] = pivot;
        
        // Copy right array into the result after the pivot
        System.arraycopy(right, 0, result, left.length + 1, right.length);

        return result;
    }

    public static void main(String[] args) {
        int[] data = {10, 7, 8, 9, 1, 5};
        int[] sortedData = quickSort(data);
        
        System.out.println(Arrays.toString(sortedData));
    }
}