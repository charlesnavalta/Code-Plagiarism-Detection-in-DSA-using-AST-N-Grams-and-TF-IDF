import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class type_2_renamed2 {

    public static List<Integer> executeSorting(List<Integer> numbersList) {
        // Return immediately if there is nothing to sort
        if (numbersList.size() <= 1) {
            return numbersList;
        }

        // Grab the last item to use as a comparison point
        int pivotValue = numbersList.get(numbersList.size() - 1);
        List<Integer> leftPartition = new ArrayList<>();
        List<Integer> rightPartition = new ArrayList<>();

        // Loop through the data and divide it up
        for (int j = 0; j < numbersList.size() - 1; j++) {
            if (numbersList.get(j) <= pivotValue) {
                leftPartition.add(numbersList.get(j));
            } else {
                rightPartition.add(numbersList.get(j));
            }
        }

        // Sort the partitions and construct the final list
        List<Integer> completedArray = new ArrayList<>();
        completedArray.addAll(executeSorting(leftPartition));
        completedArray.add(pivotValue);
        completedArray.addAll(executeSorting(rightPartition));

        return completedArray;
    }

    public static void main(String[] args) {
        // Initialize an array of integers
        List<Integer> testDataset = Arrays.asList(10, 7, 8, 9, 1, 5);
        
        // Output the sorted numbers to the console
        System.out.println(executeSorting(testDataset));
    }
}