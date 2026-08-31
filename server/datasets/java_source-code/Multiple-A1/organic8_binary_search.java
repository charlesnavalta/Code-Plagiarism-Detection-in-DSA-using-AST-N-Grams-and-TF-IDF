/*
 * Binary Search - Submission by Sophia
 * Approach: Uses an infinite while (true) loop with explicit break/return
 * statements instead of a boolean loop condition.
 */

class BinarySearch {
    public static int binarySearchLoop(int[] arr, int target) {
        int lo = 0;
        int hi = arr.length - 1;

        while (true) {
            if (lo > hi) {
                return -1;
            }

            int mid = (lo + hi) / 2;

            if (arr[mid] == target) {
                return mid;
            }

            if (arr[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        int foundIndex = binarySearchLoop(arr, target);
        System.out.println("found_index = " + foundIndex);
    }
}
