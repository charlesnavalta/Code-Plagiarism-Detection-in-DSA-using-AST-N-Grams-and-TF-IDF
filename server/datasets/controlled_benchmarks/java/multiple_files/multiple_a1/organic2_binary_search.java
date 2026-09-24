/*
 * Binary Search - Submission by Andrea
 * Approach: Iterative search using left/right naming and the
 * overflow-safe mid formula (left + (right - left) / 2).
 */

class BinarySearch {
    public static int search(int[] values, int key) {
        int left = 0;
        int right = values.length - 1;

        while (left <= right) {
            int middle = left + (right - left) / 2;

            if (values[middle] == key) {
                return middle;
            }

            if (values[middle] < key) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91};
        int target = 23;
        System.out.println("Found at index: " + search(arr, target));
    }
}
