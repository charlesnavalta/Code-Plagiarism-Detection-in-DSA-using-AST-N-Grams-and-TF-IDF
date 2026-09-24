import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class type_3_structural2 {

    public static List<Integer> advancedSort(List<Integer> collection) {
        // STRUCTURAL SHIFT 1: Split the base case into two separate 'if' blocks 
        // and use .isEmpty() instead of checking the size.
        if (collection.isEmpty()) {
            return collection;
        }
        if (collection.size() == 1) {
            return collection;
        }

        // STRUCTURAL SHIFT 2: Extract the middle element and physically remove it 
        // from a copied list so we don't have to track indices.
        List<Integer> workingList = new ArrayList<>(collection);
        int middleIndex = workingList.size() / 2;
        int pivotItem = workingList.remove(middleIndex); 

        List<Integer> leftBin = new ArrayList<>();
        List<Integer> rightBin = new ArrayList<>();

        // STRUCTURAL SHIFT 3: Use an Enhanced For-Each loop instead of an indexed loop.
        // Because we removed the pivot above, we don't need to skip it here.
        for (Integer item : workingList) {
            
            // STRUCTURAL SHIFT 4: Use a logical NOT (!) operator to flip the condition,
            // rather than just changing the > or < sign.
            if (!(item > pivotItem)) { 
                leftBin.add(item);
            } else {
                rightBin.add(item);
            }
        }

        // Recursively sort and merge using the constructor for the first addAll
        List<Integer> output = new ArrayList<>(advancedSort(leftBin));
        output.add(pivotItem);
        output.addAll(advancedSort(rightBin));

        return output;
    }

    public static void main(String[] args) {
        List<Integer> startingData = Arrays.asList(10, 7, 8, 9, 1, 5);
        System.out.println(advancedSort(startingData));
    }
}