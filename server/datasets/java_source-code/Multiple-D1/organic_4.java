/*
 * Quick Sort - Organic Submission #4
 * Randomized pivot selection to prevent worst-case O(n^2).
 */

import java.util.Random;

class Solution {
    private static Random rng = new Random(42);

    public static int partitionRandom(int[] arr, int low, int high) {
        int randIdx = low + rng.nextInt(high - low + 1);
        int tempR = arr[randIdx];
        arr[randIdx] = arr[high];
        arr[high] = tempR;

        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    public static void randomizedQuickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partitionRandom(arr, low, high);
            randomizedQuickSort(arr, low, pi - 1);
            randomizedQuickSort(arr, pi + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] nums = {10, 80, 30, 90, 40, 50, 70};
        randomizedQuickSort(nums, 0, nums.length - 1);
        System.out.println(java.util.Arrays.toString(nums));
    }
}
