import java.util.Arrays;

public class QuickSortDeadCode {

    public static int helperProcess(int[] dataInput) {
        // This is a dead code function designed to throw off the detector
        int tempVal = 0;
        for (int i = 0; i < 10; i++) {
            tempVal += i;
        }
        return tempVal;
    }

    public static int[] quickSort(int[] arr) {
        // Dead code variable
        boolean redundantStatus = true;
        
        if (arr.length <= 1) {
            return arr;
        }
        
        int pivotElement = arr[arr.length / 2];
        
        // Logic remains identical but surrounded by noise
        int[] lesserTemp = new int[arr.length];
        int[] equalTemp = new int[arr.length];
        int[] greaterTemp = new int[arr.length];
        
        int lesserCount = 0;
        int equalCount = 0;
        int greaterCount = 0;

        // Replicating the list comprehensions
        for (int item : arr) {
            if (item < pivotElement) {
                lesserTemp[lesserCount++] = item;
            } else if (item == pivotElement) {
                equalTemp[equalCount++] = item;
            } else {
                greaterTemp[greaterCount++] = item;
            }
        }

        int[] lesserSorted = quickSort(Arrays.copyOf(lesserTemp, lesserCount));
        int[] greaterSorted = quickSort(Arrays.copyOf(greaterTemp, greaterCount));
        int[] equal = Arrays.copyOf(equalTemp, equalCount);

        // Replicating: return quick_sort(lesser) + equal + quick_sort(greater)
        int[] result = new int[lesserSorted.length + equal.length + greaterSorted.length];
        
        System.arraycopy(lesserSorted, 0, result, 0, lesserSorted.length);
        System.arraycopy(equal, 0, result, lesserSorted.length, equal.length);
        System.arraycopy(greaterSorted, 0, result, lesserSorted.length + equal.length, greaterSorted.length);

        return result;
    }

    public static void main(String[] args) {
        // Dummy call that doesn't affect the actual algorithm
        helperProcess(new int[]{1, 2, 3});
        
        int[] data = {3, 6, 8, 10, 1, 2, 1};
        System.out.println(Arrays.toString(quickSort(data)));
    }
}