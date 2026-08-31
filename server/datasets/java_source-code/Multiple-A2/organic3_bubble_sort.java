/*
 * Bubble Sort - organic3
 * Approach: While loop tracking swapped flag until no swaps occur.
 */

import java.util.Arrays;

class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped = true;
        while (swapped) {
            swapped = false;
            for (int i = 0; i < n - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    int temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
            }
            n--;
        }
        return arr;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Sorted array: " + Arrays.toString(bubbleSort(arr)));
    }
}
