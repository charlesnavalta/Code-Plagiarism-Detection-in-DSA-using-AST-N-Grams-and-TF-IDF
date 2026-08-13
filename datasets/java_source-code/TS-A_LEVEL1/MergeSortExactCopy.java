import java.util.Arrays;

public class MergeSortExactCopy {

    public static int[] mergeSort(int[] arr) {
        // Base case: if array is size 0 or 1, it is already sorted
        if (arr.length <= 1) {
            return arr;
        }

        int mid = arr.length / 2;
        
        // Replicating Python's slicing: arr[:mid] and arr[mid:]
        int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));

        return merge(left, right);
    }

    public static int[] merge(int[] left, int[] right) {
        // Create a result array exactly large enough to hold both halves
        int[] result = new int[left.length + right.length];
        
        int i = 0; // index for left array
        int j = 0; // index for right array
        int k = 0; // index for result array

        // Compare elements and add the smaller one to the result
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }

        // Replicating Python's result.extend(left[i:])
        while (i < left.length) {
            result[k++] = left[i++];
        }

        // Replicating Python's result.extend(right[j:])
        while (j < right.length) {
            result[k++] = right[j++];
        }

        return result;
    }

    public static void main(String[] args) {
        int[] data = {38, 27, 43, 3, 9, 82, 10};
        int[] sortedData = mergeSort(data);
        
        // Arrays.toString is needed to print the array contents beautifully 
        System.out.println(Arrays.toString(sortedData));
    }
}