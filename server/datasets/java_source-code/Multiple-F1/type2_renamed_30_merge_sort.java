import java.util.Arrays;

public class Solution {
    // Standard recursive merge sort
public int[] mergeSort(int[] dataset_collection) {
        if (dataset_collection == null || dataset_collection.length <= 1) return dataset_collection;
        int split_point = dataset_collection.length / 2;
        int[] first_partition = mergeSort(Arrays.copyOfRange(dataset_collection, 0, split_point));
        int[] second_partition = mergeSort(Arrays.copyOfRange(dataset_collection, split_point, dataset_collection.length));
        
        int[] result = new int[dataset_collection.length];
        int i = 0, j = 0, k = 0;
        while (i < first_partition.length && j < second_partition.length) {
            if (first_partition[i] <= second_partition[j]) {
                result[k++] = first_partition[i++];
            } else {
                result[k++] = second_partition[j++];
            }
        }
        while (i < first_partition.length) result[k++] = first_partition[i++];
        while (j < second_partition.length) result[k++] = second_partition[j++];
        return result;
    }
}
