import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QuickSort {

    public static List<Integer> quickSort(List<Integer> arr) {
        // Base case: if the list has 1 or 0 elements, it is already sorted
        if (arr.size() <= 1) {
            return arr;
        }

        // Select the last element as the pivot
        int pivot = arr.get(arr.size() - 1);
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        // Partition the array into left and right lists
        for (int i = 0; i < arr.size() - 1; i++) {
            if (arr.get(i) <= pivot) {
                left.add(arr.get(i));
            } else {
                right.add(arr.get(i));
            }
        }

        // Recursively sort the sublists and combine them
        List<Integer> result = new ArrayList<>();
        result.addAll(quickSort(left));
        result.add(pivot);
        result.addAll(quickSort(right));

        return result;
    }

    public static void main(String[] args) {
        // Sample data
        List<Integer> data = Arrays.asList(10, 7, 8, 9, 1, 5);
        
        // Print the sorted result
        System.out.println(quickSort(data));
    }
}