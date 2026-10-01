public class MergeSortSuite {
    private int[] data;
    private long inversions;

    public MergeSortSuite(int[] input) {
        this.data = (input != null) ? input.clone() : new int[0];
        this.inversions = 0;
    }

    private int[] merge(int[] left, int[] right) {
        int[] out = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (right[j] < left[i]) {
                out[k++] = right[j++];
                this.inversions += (left.length - i);
            } else {
                out[k++] = left[i++];
            }
        }
        while (i < left.length) out[k++] = left[i++];
        while (j < right.length) out[k++] = right[j++];
        return out;
    }

    private int[] sortRecursive(int[] array) {
        if (array.length <= 1) return array;
        int split = array.length / 2;
        int[] leftSub = new int[split];
        int[] rightSub = new int[array.length - split];
        System.arraycopy(array, 0, leftSub, 0, split);
        System.arraycopy(array, split, rightSub, 0, array.length - split);
        return merge(sortRecursive(leftSub), sortRecursive(rightSub));
    }

    public int[] executeSort() {
        if (this.data.length > 0) {
            this.data = sortRecursive(this.data);
        }
        return this.data;
    }

    public boolean isSorted() {
        int idx = 0;
        while (idx < this.data.length - 1) {
            if (this.data[idx] > this.data[idx + 1]) return false;
            idx++;
        }
        return true;
    }
}
