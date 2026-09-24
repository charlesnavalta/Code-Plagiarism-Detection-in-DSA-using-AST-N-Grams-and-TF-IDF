// Organic MergeSort Student Submission 23
public class InPlaceIndexMergeSort {
    private static void mergeInPlace(int[] arr, int start, int mid, int end) {
        int start2 = mid + 1;
        if (arr[mid] <= arr[start2]) return;
        while (start <= mid && start2 <= end) {
            if (arr[start] <= arr[start2]) {
                start++;
            } else {
                int val = arr[start2];
                int idx = start2;
                while (idx != start) {
                    arr[idx] = arr[idx - 1];
                    idx--;
                }
                arr[start] = val;
                start++; mid++; start2++;
            }
        }
    }
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            mergeInPlace(arr, l, m, r);
        }
    }
}
