/*
 * Quick Sort - Organic Submission #2
 * Hoare partition scheme with two converging pointers.
 */

class Solution {
    public static int hoarePartition(int[] arr, int low, int high) {
        int pivot = arr[low];
        int i = low - 1;
        int j = high + 1;
        while (true) {
            do { i++; } while (arr[i] < pivot);
            do { j--; } while (arr[j] > pivot);
            if (i >= j) return j;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    public static void quickSortHoare(int[] arr, int low, int high) {
        if (low < high) {
            int p = hoarePartition(arr, low, high);
            quickSortHoare(arr, low, p);
            quickSortHoare(arr, p + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] nums = {19, 22, 63, 105, 2, 46};
        quickSortHoare(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
