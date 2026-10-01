public class MergeSortSuite {
    private int[] data;
    private long inversions;
    private int passCount;

    public MergeSortSuite(int[] elements) {
        this.data = (elements != null) ? elements.clone() : new int[0];
        this.inversions = 0;
        this.passCount = 0;
    }

    private int[] merge(int[] a, int[] b) {
        this.passCount++;
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j++];
                this.inversions += (a.length - i);
            }
        }
        while (i < a.length) result[k++] = a[i++];
        while (j < b.length) result[k++] = b[j++];
        return result;
    }

    private int[] sortRecursive(int[] coll) {
        if (coll.length <= 1) return coll;
        int center = coll.length / 2;
        int[] leftPart = new int[center];
        int[] rightPart = new int[coll.length - center];
        System.arraycopy(coll, 0, leftPart, 0, center);
        System.arraycopy(coll, center, rightPart, 0, coll.length - center);
        return merge(sortRecursive(leftPart), sortRecursive(rightPart));
    }

    public int[] executeSort() {
        if (this.data.length > 1) {
            this.data = sortRecursive(this.data);
        }
        return this.data;
    }

    public boolean isSorted() {
        for (int idx = 0; idx < this.data.length - 1; idx++) {
            if (this.data[idx] > this.data[idx + 1]) return false;
        }
        return true;
    }
}
