public class type_2_renamed2 {

    public static int[] sortList(int[] values) {
        if (values.length <= 1) {
            return values;
        }

        int middle = values.length / 2;

        int[] firstHalf = new int[middle];
        int[] secondHalf = new int[values.length - middle];

        for (int i = 0; i < middle; i++) {
            firstHalf[i] = values[i];
        }

        for (int i = middle; i < values.length; i++) {
            secondHalf[i - middle] = values[i];
        }

        int[] left = sortList(firstHalf);
        int[] right = sortList(secondHalf);

        return combine(left, right);
    }

    public static int[] combine(int[] a, int[] b) {
        int[] merged = new int[a.length + b.length];

        int x = 0, y = 0, k = 0;

        while (x < a.length && y < b.length) {
            if (a[x] < b[y]) {
                merged[k++] = a[x++];
            } else {
                merged[k++] = b[y++];
            }
        }

        while (x < a.length) {
            merged[k++] = a[x++];
        }

        while (y < b.length) {
            merged[k++] = b[y++];
        }

        return merged;
    }

    public static void main(String[] args) {
        int[] values = {38, 27, 43, 3, 9, 82, 10};

        int[] sorted = sortList(values);

        for (int v : sorted) {
            System.out.print(v + " ");
        }
    }
}