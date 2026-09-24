/*
 * Binary Search - Submission by Louise
 * Approach: Recursive implementation with helper method overloading
 * so callers only need to pass the array and target.
 */

class BinarySearch {
    public static int find(int[] arr, int target) {
        return find(arr, target, 0, arr.length - 1);
    }

    public static int find(int[] arr, int target, int lo, int hi) {
        if (lo > hi) {
            return -1;
        }

        int mid = (lo + hi) / 2;
        int current = arr[mid];

        if (current == target) {
            return mid;
        }
        if (current > target) {
            return find(arr, target, lo, mid - 1);
        }
        return find(arr, target, mid + 1, hi);
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        System.out.println("Target located at: " + find(arr, target));
    }
}
