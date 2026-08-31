/*
 * Quick Sort - Organic Submission #6
 * Three-way partitioning for arrays with high duplicates.
 */

class Solution {
    public static int[] threeWayPartition(int[] arr, int low, int high) {
        int pivot = arr[low];
        int lt = low;
        int gt = high;
        int i = low + 1;
        while (i <= gt) {
            if (arr[i] < pivot) {
                int t = arr[lt]; arr[lt] = arr[i]; arr[i] = t;
                lt++;
                i++;
            } else if (arr[i] > pivot) {
                int t = arr[gt]; arr[gt] = arr[i]; arr[i] = t;
                gt--;
            } else {
                i++;
            }
        }
        return new int[]{lt, gt};
    }

    public static void quickSort3Way(int[] arr, int low, int high) {
        if (low < high) {
            int[] bounds = threeWayPartition(arr, low, high);
            quickSort3Way(arr, low, bounds[0] - 1);
            quickSort3Way(arr, bounds[1] + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] nums = {4, 2, 4, 4, 1, 3, 2, 4, 1};
        quickSort3Way(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
