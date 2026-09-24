/*
 * Bubble Sort - organic7
 * Approach: Cocktail shaker sort - bidirectional variant of bubble sort.
 */

import java.util.Arrays;

class CocktailSort {
    public static int[] cocktailSort(int[] arr) {
        int n = arr.length;
        int start = 0;
        int end = n - 1;
        boolean swapped = true;

        while (swapped) {
            swapped = false;

            for (int i = start; i < end; i++) {
                if (arr[i] > arr[i + 1]) {
                    int temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
            }

            if (!swapped) {
                break;
            }

            end--;
            swapped = false;

            for (int i = end - 1; i >= start; i--) {
                if (arr[i] > arr[i + 1]) {
                    int temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
            }

            start++;
        }

        return arr;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 5, 77, 1};
        System.out.println("Cocktail sorted: " + Arrays.toString(cocktailSort(arr)));
    }
}
