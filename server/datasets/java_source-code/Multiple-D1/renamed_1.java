/*
 * Quick Sort - Renamed Submission #1
 * Derived from organic_2: variables and function names renamed.
 */

class Solution {
    public static int splitHoare(int[] dataList, int startIdx, int endIdx) {
        int pivotVal = dataList[startIdx];
        int leftCursor = startIdx - 1;
        int rightCursor = endIdx + 1;
        while (true) {
            do { leftCursor++; } while (dataList[leftCursor] < pivotVal);
            do { rightCursor--; } while (dataList[rightCursor] > pivotVal);
            if (leftCursor >= rightCursor) return rightCursor;
            int swapHold = dataList[leftCursor];
            dataList[leftCursor] = dataList[rightCursor];
            dataList[rightCursor] = swapHold;
        }
    }

    public static void executeSort(int[] dataList, int startIdx, int endIdx) {
        if (startIdx < endIdx) {
            int splitPoint = splitHoare(dataList, startIdx, endIdx);
            executeSort(dataList, startIdx, splitPoint);
            executeSort(dataList, splitPoint + 1, endIdx);
        }
    }

    public static void main(String[] args) {
        int[] items = {19, 22, 63, 105, 2, 46};
        executeSort(items, 0, items.length - 1);
        System.out.println(java.util.Arrays.toString(items));
    }
}
