/*
 * Quick Sort - Structural Modification #2
 * Derived from organic_5: inverted conditional, swapped recursion order.
 */

class Solution {
    private static int calcMedian(int[] items, int start, int end) {
        int center = (start + end) / 2;
        if (items[center] < items[start]) { int t = items[start]; items[start] = items[center]; items[center] = t; }
        if (items[end] < items[start]) { int t = items[start]; items[start] = items[end]; items[end] = t; }
        if (items[end] < items[center]) { int t = items[center]; items[center] = items[end]; items[end] = t; }
        int t = items[center]; items[center] = items[end - 1]; items[end - 1] = t;
        return items[end - 1];
    }

    public static int splitMedian(int[] items, int start, int end) {
        int anchor = calcMedian(items, start, end);
        int lPtr = start;
        int rPtr = end - 1;
        while (lPtr < rPtr) {
            while (items[++lPtr] < anchor);
            while (items[--rPtr] > anchor);
            if (lPtr >= rPtr) break;
            int t = items[lPtr]; items[lPtr] = items[rPtr]; items[rPtr] = t;
        }
        int t = items[lPtr]; items[lPtr] = items[end - 1]; items[end - 1] = t;
        return lPtr;
    }

    public static void quickSortMedian(int[] items, int start, int end) {
        if (end - start < 10) {
            for (int idx = start + 1; idx <= end; idx++) {
                int val = items[idx];
                int pos = idx - 1;
                while (pos >= start && items[pos] > val) {
                    items[pos + 1] = items[pos];
                    pos--;
                }
                items[pos + 1] = val;
            }
        } else {
            int pivotIdx = splitMedian(items, start, end);
            quickSortMedian(items, pivotIdx + 1, end);
            quickSortMedian(items, start, pivotIdx - 1);
        }
    }

    public static void main(String[] args) {
        int[] vals = {24, 2, 45, 20, 56, 75, 2, 56, 99, 53, 12};
        quickSortMedian(vals, 0, vals.length - 1);
        System.out.println(java.util.Arrays.toString(vals));
    }
}
