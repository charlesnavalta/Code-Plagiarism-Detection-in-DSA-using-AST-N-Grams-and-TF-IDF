/*
 * Quick Sort - Organic Submission #3
 * Lomuto variant using the first element as pivot.
 */

class Solution {
    public static int partitionFirst(int[] arr, int low, int high) {
        int pivot = arr[low];
        int swapIndex = low;
        for (int i = low + 1; i <= high; i++) {
            if (arr[i] < pivot) {
                swapIndex++;
                int temp = arr[swapIndex];
                arr[swapIndex] = arr[i];
                arr[i] = temp;
            }
        }
        int temp = arr[low];
        arr[low] = arr[swapIndex];
        arr[swapIndex] = temp;
        return swapIndex;
    }

    public static void quickSortFirst(int[] arr, int low, int high) {
        if (low < high) {
            int p = partitionFirst(arr, low, high);
            quickSortFirst(arr, low, p - 1);
            quickSortFirst(arr, p + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] nums = {38, 27, 43, 3, 9, 82, 10};
        quickSortFirst(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
