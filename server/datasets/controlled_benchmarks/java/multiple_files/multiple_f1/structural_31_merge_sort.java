public class MergeSortSuite {
    private int[] data;
    private long inversions;

    public MergeSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
        this.inversions = 0;
    }

    private int[] mergeBlocks(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
                this.inversions += (left.length - i);
            }
        }
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }

    private int[] sortRecursive(int[] arr) {
        if (arr.length <= 1) return arr;
        int mid = arr.length / 2;
        int[] left = new int[mid];
        int[] right = new int[arr.length - mid];
        for (int p = 0; p < mid; p++) left[p] = arr[p];
        for (int p = mid; p < arr.length; p++) right[p - mid] = arr[p];
        return mergeBlocks(sortRecursive(left), sortRecursive(right));
    }

    public int[] executeSort() {
        if (this.data.length > 1) {
            this.data = sortRecursive(this.data);
        }
        return this.data;
    }

    public boolean isSorted() {
        for (int i = 0; i < this.data.length - 1; i++) {
            if (this.data[i] > this.data[i + 1]) return false;
        }
        return true;
    }
}
