import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class type_2_renamed {

    public static List<Integer> sortSequence(List<Integer> inputList) {
        // Base case: if the list has 1 or 0 elements, it is already sorted
        if (inputList.size() <= 1) {
            return inputList;
        }

        // Select the last element as the reference
        int anchor = inputList.get(inputList.size() - 1);
        List<Integer> smallerElements = new ArrayList<>();
        List<Integer> largerElements = new ArrayList<>();

        // Partition the array into smaller and larger lists
        for (int index = 0; index < inputList.size() - 1; index++) {
            if (inputList.get(index) <= anchor) {
                smallerElements.add(inputList.get(index));
            } else {
                largerElements.add(inputList.get(index));
            }
        }

        // Recursively sort the sublists and combine them
        List<Integer> mergedList = new ArrayList<>();
        mergedList.addAll(sortSequence(smallerElements));
        mergedList.add(anchor);
        mergedList.addAll(sortSequence(largerElements));

        return mergedList;
    }

    public static void main(String[] args) {
        // Sample data
        List<Integer> sampleValues = Arrays.asList(10, 7, 8, 9, 1, 5);
        
        // Print the sorted result
        System.out.println(sortSequence(sampleValues));
    }
}