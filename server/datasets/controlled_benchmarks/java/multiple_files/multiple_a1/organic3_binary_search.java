/*
 * Binary Search - Submission by Kevin
 * Approach: Recursive implementation, passing lo/hi bounds explicitly
 * on every call.
 */

class BinarySearch {
    public static int binarySearchRecursive(int[] arr, int target, int lo, int hi) {
        if (lo > hi) {
            return -1;
        }

        int mid = (lo + hi) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            return binarySearchRecursive(arr, target, mid + 1, hi);
        } else {
            return binarySearchRecursive(arr, target, lo, mid - 1);
        }
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        int idx = binarySearchRecursive(arr, target, 0, arr.length - 1);
        System.out.println("Result: " + idx);
    }
}
