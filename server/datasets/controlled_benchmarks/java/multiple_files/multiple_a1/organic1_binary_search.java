/*
 * Binary Search - Submission by Miguel
 * Approach: Classic iterative binary search using inclusive bounds
 * (lo, hi) and mid = (lo + hi) / 2.
 */

class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int lo = 0;
        int hi = arr.length - 1;

        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        int result = binarySearch(arr, target);
        System.out.println("Index of " + target + ": " + result);
    }
}
