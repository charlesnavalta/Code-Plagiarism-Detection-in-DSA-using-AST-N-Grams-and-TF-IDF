/*
 * Bubble Sort - organic8
 * Approach: Classic nested for loops tracking swap count and writing
 * comparison as !(a <= b) instead of a > b.
 */

import java.util.Arrays;

class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        int swapCount = 0;

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                int a = arr[j];
                int b = arr[j + 1];
                if (!(a <= b)) {
                    arr[j] = b;
                    arr[j + 1] = a;
                    swapCount++;
                }
            }
        }

        System.out.println("Total swaps: " + swapCount);
        return arr;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Final: " + Arrays.toString(bubbleSort(arr)));
    }
}
