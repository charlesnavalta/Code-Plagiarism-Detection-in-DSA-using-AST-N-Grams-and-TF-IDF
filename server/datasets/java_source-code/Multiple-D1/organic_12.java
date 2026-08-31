/*
 * Quick Sort - Organic Submission #12
 * Tail-call optimized Quick Sort (recurse on smaller half, loop on larger).
 */

class Solution {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }

    public static void quickSortTail(int[] arr, int low, int high) {
        while (low < high) {
            int pi = partition(arr, low, high);
            if (pi - low < high - pi) {
                quickSortTail(arr, low, pi - 1);
                low = pi + 1;
            } else {
                quickSortTail(arr, pi + 1, high);
                high = pi - 1;
            }
        }
    }

    public static void main(String[] args) {
        int[] nums = {10, 7, 8, 9, 1, 5};
        quickSortTail(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
