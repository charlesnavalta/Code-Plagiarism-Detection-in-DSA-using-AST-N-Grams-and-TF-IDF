import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QuickSortRearranged {

    // Core logic: splits the array into left and right partitions.
    public static List<List<Integer>> extractPartitions(List<Integer> arr, int pivot) {
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        for (int i = 0; i < arr.size() - 1; i++) {
            if (arr.get(i) <= pivot) {
                left.add(arr.get(i));
            } else {
                right.add(arr.get(i));
            }
        }

        // Java doesn't have tuples, so we return a list containing both partitions
        return Arrays.asList(left, right);
    }

    // Main recursive method.
    public static List<Integer> quickSort(List<Integer> arr) {
        if (arr.size() <= 1) {
            return arr;
        }

        int pivot = arr.get(arr.size() - 1);

        // Call the core logic method and unpack the results
        List<List<Integer>> partitions = extractPartitions(arr, pivot);
        List<Integer> left = partitions.get(0);
        List<Integer> right = partitions.get(1);

        // Recombine: quick_sort(left) + [pivot] + quick_sort(right)
        List<Integer> result = new ArrayList<>();
        result.addAll(quickSort(left));
        result.add(pivot);
        result.addAll(quickSort(right));

        return result;
    }

    public static void main(String[] args) {
        List<Integer> data = Arrays.asList(10, 7, 8, 9, 1, 5);
        System.out.println(quickSort(data));
    }
}