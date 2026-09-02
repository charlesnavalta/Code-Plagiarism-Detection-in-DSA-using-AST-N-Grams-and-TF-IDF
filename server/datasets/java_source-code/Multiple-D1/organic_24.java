// Organic Student Submission 24
import java.util.Stack;
public class IterativeQuickSort {
    public static void quickSort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{0, arr.length - 1});
        while (!stack.isEmpty()) {
            int[] range = stack.pop();
            int low = range[0], high = range[1];
            if (low < high) {
                int pivot = arr[high];
                int i = low - 1;
                for (int j = low; j < high; j++) {
                    if (arr[j] <= pivot) {
                        i++;
                        int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
                    }
                }
                int t = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = t;
                int pi = i + 1;
                stack.push(new int[]{low, pi - 1});
                stack.push(new int[]{pi + 1, high});
            }
        }
    }
}
