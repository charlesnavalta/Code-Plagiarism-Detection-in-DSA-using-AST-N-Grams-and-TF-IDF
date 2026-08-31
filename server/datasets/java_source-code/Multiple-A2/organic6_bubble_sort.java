/*
 * Bubble Sort - organic6
 * Approach: Entirely index-driven using nested while loops instead of for loops.
 */

import java.util.Arrays;

class BubbleSort {
    public static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        int i = 0;
        while (i < n - 1) {
            int j = 0;
            while (j < n - 1 - i) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
                j++;
            }
            i++;
        }
        return arr;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Sorted: " + Arrays.toString(bubbleSort(arr)));
    }
}
