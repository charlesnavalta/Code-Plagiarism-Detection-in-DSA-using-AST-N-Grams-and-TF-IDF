/*
 * Quick Sort - Organic Submission #8
 * Iterative Quick Sort using an explicit stack of index ranges.
 */

import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }

    public static void quickSortIterative(int[] arr) {
        Deque<int[]> stack = new ArrayDeque<>();
        stack.push(new int[]{0, arr.length - 1});
        while (!stack.isEmpty()) {
            int[] range = stack.pop();
            int low = range[0];
            int high = range[1];
            if (low < high) {
                int p = partition(arr, low, high);
                stack.push(new int[]{low, p - 1});
                stack.push(new int[]{p + 1, high});
            }
        }
    }

    public static void main(String[] args) {
        int[] data = {45, 12, 85, 32, 89, 39, 69, 44};
        quickSortIterative(data);
        System.out.println(java.util.Arrays.toString(data));
    }
}
