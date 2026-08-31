/*
 * Quick Sort - Organic Submission #9
 * Uses modular helper functions for swap and bounds check.
 */

class Solution {
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int idx = low;
        for (int k = low; k < high; k++) {
            if (arr[k] < pivot) {
                swap(arr, idx, k);
                idx++;
            }
        }
        swap(arr, idx, high);
        return idx;
    }

    public static void quickSortModular(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSortModular(arr, low, pi - 1);
            quickSortModular(arr, pi + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] nums = {8, 4, 7, 2, 5, 1, 9, 3, 6};
        quickSortModular(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
