/*
 * Bubble Sort - organic5
 * Approach: Pairwise scanning with a while (true) / break loop.
 */

import java.util.Arrays;

class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        while (true) {
            boolean swapped = false;
            for (int i = 0; i < arr.length - 1; i++) {
                int a = arr[i];
                int b = arr[i + 1];
                if (a > b) {
                    arr[i] = b;
                    arr[i + 1] = a;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
        return arr;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Output: " + Arrays.toString(bubbleSort(arr)));
    }
}
