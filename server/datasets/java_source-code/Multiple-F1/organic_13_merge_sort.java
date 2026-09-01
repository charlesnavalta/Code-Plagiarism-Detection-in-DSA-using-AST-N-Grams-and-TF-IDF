import java.util.Arrays;

public class Solution {
    // Standard recursive merge sort
public int[] mergeSort(int[] items_12) {
        if (items_12 == null || items_12.length <= 1) return items_12;
        int mid = items_12.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(items_12, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(items_12, mid, items_12.length));
        
        int[] result = new int[items_12.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }
}
