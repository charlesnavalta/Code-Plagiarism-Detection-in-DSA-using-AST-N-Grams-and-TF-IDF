/*
 * Binary Search - Submission by Patricia
 * Approach: Delegates search to standard library (Arrays.binarySearch)
 * instead of hand-rolling the loop.
 */

import java.util.Arrays;

class BinarySearch {
    public static int findIndex(int[] arr, int target) {
        int pos = Arrays.binarySearch(arr, target);
        if (pos >= 0 && pos < arr.length && arr[pos] == target) {
            return pos;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        System.out.println("bisect result -> " + findIndex(arr, target));
    }
}
