// Organic Student Submission 6
public class DualPivotQuickSort {
    public static void dualPivotSort(int[] arr, int low, int high) {
        if (low < high) {
            if (arr[low] > arr[high]) {
                int temp = arr[low]; arr[low] = arr[high]; arr[high] = temp;
            }
            int p = arr[low], q = arr[high];
            int l = low + 1, g = high - 1, k = l;
            while (k <= g) {
                if (arr[k] < p) {
                    int t = arr[k]; arr[k] = arr[l]; arr[l] = t;
                    l++;
                } else if (arr[k] >= q) {
                    while (arr[g] > q && k < g) g--;
                    int t = arr[k]; arr[k] = arr[g]; arr[g] = t;
                    g--;
                    if (arr[k] < p) {
                        int t2 = arr[k]; arr[k] = arr[l]; arr[l] = t2;
                        l++;
                    }
                }
                k++;
            }
            l--; g++;
            int t1 = arr[low]; arr[low] = arr[l]; arr[l] = t1;
            int t2 = arr[high]; arr[high] = arr[g]; arr[g] = t2;
            dualPivotSort(arr, low, l - 1);
            dualPivotSort(arr, l + 1, g - 1);
            dualPivotSort(arr, g + 1, high);
        }
    }
}
