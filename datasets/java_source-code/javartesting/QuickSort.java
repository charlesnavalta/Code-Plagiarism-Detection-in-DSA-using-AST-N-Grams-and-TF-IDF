import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QuickSort {

    public static List<Integer> quickSort(List<Integer> arr) {
        // Base case
        if (arr.size() <= 1) {
            return arr;
        }

        // Pivot is the last element
        int pivot = arr.get(arr.size() - 1);
        
        List<Integer> left = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        // Partitioning loop
        for (int i = 0; i < arr.size() - 1; i++) {
            if (arr.get(i) <= pivot) {
                left.add(arr.get(i));
            } else {
                right.add(arr.get(i));
            }
        }

        // Recombining the lists: quick_sort(left) + [pivot] + quick_sort(right)
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