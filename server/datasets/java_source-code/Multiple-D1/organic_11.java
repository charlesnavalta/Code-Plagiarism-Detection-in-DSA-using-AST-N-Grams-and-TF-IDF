/*
 * Quick Sort - Organic Submission #11
 * Dual-pivot Quick Sort algorithm.
 */

class Solution {
    public static void dualPivotQuickSort(int[] arr, int low, int high) {
        if (low < high) {
            if (arr[low] > arr[high]) {
                int t = arr[low]; arr[low] = arr[high]; arr[high] = t;
            }
            int p = arr[low];
            int q = arr[high];
            int l = low + 1;
            int g = high - 1;
            int k = low + 1;
            while (k <= g) {
                if (arr[k] < p) {
                    int t = arr[k]; arr[k] = arr[l]; arr[l] = t;
                    l++;
                } else if (arr[k] >= q) {
                    while (arr[g] > q && k < g) g--;
                    int t = arr[k]; arr[k] = arr[g]; arr[g] = t;
                    g--;
                    if (arr[k] < p) {
                        int t2 = arr[k]; arr[k] = arr[l]; arr[l] = t2;
                        l++;
                    }
                }
                k++;
            }
            l--;
            g++;
            int t = arr[low]; arr[low] = arr[l]; arr[l] = t;
            t = arr[high]; arr[high] = arr[g]; arr[g] = t;

            dualPivotQuickSort(arr, low, l - 1);
            dualPivotQuickSort(arr, l + 1, g - 1);
            dualPivotQuickSort(arr, g + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] nums = {24, 8, 42, 75, 29, 77, 38, 57};
        dualPivotQuickSort(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
