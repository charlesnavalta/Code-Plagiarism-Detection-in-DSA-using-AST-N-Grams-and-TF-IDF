public class type_3_structural {

    public static int[] mergeSort(int[] arr) {
        int n = arr.length;
        int width = 1;

        while (width < n) {
            for (int i = 0; i < n; i += 2 * width) {

                int leftSize = Math.min(width, n - i);
                int rightSize = Math.min(width, n - (i + width));

                int[] left = new int[leftSize];
                int[] right = new int[rightSize];

                for (int x = 0; x < leftSize; x++) {
                    left[x] = arr[i + x];
                }

                for (int x = 0; x < rightSize; x++) {
                    right[x] = arr[i + width + x];
                }

                int[] merged = merge(left, right);

                for (int x = 0; x < merged.length; x++) {
                    arr[i + x] = merged[x];
                }
            }

            width *= 2;
        }

        return arr;
    }

    public static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];

        int i = 0, j = 0, k = 0;

        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }

        while (i < left.length) {
            result[k++] = left[i++];
        }

        while (j < right.length) {
            result[k++] = right[j++];
        }

        return result;
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};

        int[] sorted = mergeSort(arr);

        for (int v : sorted) {
            System.out.print(v + " ");
        }
    }
}