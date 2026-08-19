import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class type_3_structural {

    public static List<Integer> customSort(List<Integer> dataSet) {
        // Evaluate base condition using a variable instead of an inline check
        int length = dataSet.size();
        if (length < 2) {
            return dataSet;
        }

        // STRUCTURAL SHIFT 1: Use the FIRST element as the pivot instead of the LAST
        int pivotNode = dataSet.get(0);
        List<Integer> lowerHalf = new ArrayList<>();
        List<Integer> upperHalf = new ArrayList<>();

        // STRUCTURAL SHIFT 2: Replace the 'for' loop with a 'while' loop
        int index = 1; // Start at 1 because index 0 is our pivot
        while (index < length) {
            int currentVal = dataSet.get(index);
            
            // STRUCTURAL SHIFT 3: Flip the if/else logic (check 'greater than' first)
            if (currentVal > pivotNode) {
                upperHalf.add(currentVal);
            } else {
                lowerHalf.add(currentVal);
            }
            index++;
        }

        // Recursively sort and merge
        List<Integer> finalResult = new ArrayList<>();
        finalResult.addAll(customSort(lowerHalf));
        finalResult.add(pivotNode);
        finalResult.addAll(customSort(upperHalf));

        return finalResult;
    }

    public static void main(String[] args) {
        List<Integer> rawNumbers = Arrays.asList(10, 7, 8, 9, 1, 5);
        System.out.println(customSort(rawNumbers));
    }
}