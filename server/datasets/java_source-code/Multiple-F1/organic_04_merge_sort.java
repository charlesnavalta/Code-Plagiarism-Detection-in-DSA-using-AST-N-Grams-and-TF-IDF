import java.util.Arrays;

public class Solution {
    // Standard recursive merge sort
public int[] mergeSort(int[] items_3) {
        if (items_3 == null || items_3.length <= 1) return items_3;
        int mid = items_3.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(items_3, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(items_3, mid, items_3.length));
        
        int[] result = new int[items_3.length];
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
