/*
 * Quick Sort - Structural Modification #1
 * Derived from organic_4: helper swap extracted, statement reordered.
 */

import java.util.Random;

class Solution {
    private static Random rng = new Random(42);

    private static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    public static int partitionRandom(int[] arr, int low, int high) {
        int chosen = low + rng.nextInt(high - low + 1);
        swap(arr, chosen, high);
        int target = arr[high];
        int border = low - 1;
        for (int step = low; step < high; step++) {
            if (arr[step] <= target) {
                border++;
                swap(arr, border, step);
            }
        }
        swap(arr, border + 1, high);
        return border + 1;
    }

    public static void randomizedQuickSort(int[] arr, int low, int high) {
        if (low >= high) return;
        int idx = partitionRandom(arr, low, high);
        randomizedQuickSort(arr, idx + 1, high);
        randomizedQuickSort(arr, low, idx - 1);
    }

    public static void main(String[] args) {
        int[] nums = {10, 80, 30, 90, 40, 50, 70};
        randomizedQuickSort(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
