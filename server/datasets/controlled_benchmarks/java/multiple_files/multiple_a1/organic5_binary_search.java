/*
 * Binary Search - Submission by Nathan
 * Approach: Half-open interval [lo, hi) instead of inclusive bounds -
 * hi starts at arr.length and the loop condition is lo < hi.
 */

class BinarySearch {
    public static int locate(int[] arr, int target) {
        int lo = 0;
        int hi = arr.length;

        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        int outcome = locate(arr, target);
        System.out.println("Search outcome: " + outcome);
    }
}
