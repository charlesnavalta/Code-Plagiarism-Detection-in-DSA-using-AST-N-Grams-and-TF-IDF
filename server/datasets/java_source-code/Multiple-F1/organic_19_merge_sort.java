import java.util.Arrays;

public class Solution {
    // Standard recursive merge sort
public int[] mergeSort(int[] items_18) {
        if (items_18 == null || items_18.length <= 1) return items_18;
        int mid = items_18.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(items_18, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(items_18, mid, items_18.length));
        
        int[] result = new int[items_18.length];
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
