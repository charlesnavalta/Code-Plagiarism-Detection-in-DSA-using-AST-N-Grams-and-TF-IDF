/*
 * Bubble Sort - organic4
 * Approach: Recursive implementation - each call performs one pass
 * over unsorted portion and recurses on n-1.
 */

import java.util.Arrays;

class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        return bubbleSort(arr, arr.length);
    }

    public static int[] bubbleSort(int[] arr, int n) {
        if (n <= 1) {
            return arr;
        }

        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
        }

        return bubbleSort(arr, n - 1);
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Recursive result: " + Arrays.toString(bubbleSort(arr)));
    }
}
