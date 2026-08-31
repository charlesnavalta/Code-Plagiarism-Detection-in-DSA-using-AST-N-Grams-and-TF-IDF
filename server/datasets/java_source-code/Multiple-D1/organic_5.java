/*
 * Quick Sort - Organic Submission #5
 * Median-of-three pivot selection.
 */

class Solution {
    private static int medianOfThree(int[] arr, int low, int high) {
        int mid = (low + high) / 2;
        if (arr[low] > arr[mid]) { int t = arr[low]; arr[low] = arr[mid]; arr[mid] = t; }
        if (arr[low] > arr[high]) { int t = arr[low]; arr[low] = arr[high]; arr[high] = t; }
        if (arr[mid] > arr[high]) { int t = arr[mid]; arr[mid] = arr[high]; arr[high] = t; }
        int t = arr[mid]; arr[mid] = arr[high - 1]; arr[high - 1] = t;
        return arr[high - 1];
    }

    public static int partitionMedian(int[] arr, int low, int high) {
        int pivot = medianOfThree(arr, low, high);
        int i = low;
        int j = high - 1;
        while (true) {
            while (arr[++i] < pivot);
            while (arr[--j] > pivot);
            if (i >= j) break;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        int t = arr[i]; arr[i] = arr[high - 1]; arr[high - 1] = t;
        return i;
    }

    public static void quickSortMedian(int[] arr, int low, int high) {
        if (low + 10 <= high) {
            int p = partitionMedian(arr, low, high);
            quickSortMedian(arr, low, p - 1);
            quickSortMedian(arr, p + 1, high);
        } else {
            for (int i = low + 1; i <= high; i++) {
                int key = arr[i];
                int j = i - 1;
                while (j >= low && arr[j] > key) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = key;
            }
        }
    }

    public static void main(String[] args) {
        int[] vals = {24, 2, 45, 20, 56, 75, 2, 56, 99, 53, 12};
        quickSortMedian(vals, 0, vals.length - 1);
        System.out.println(java.util.Arrays.toString(vals));
    }
}
