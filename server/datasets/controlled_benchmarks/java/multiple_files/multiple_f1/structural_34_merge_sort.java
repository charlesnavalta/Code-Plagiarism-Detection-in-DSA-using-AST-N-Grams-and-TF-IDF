public class MergeSortSuite {
    private int[] data;
    private long inversions;

    public MergeSortSuite(int[] items) {
        this.data = (items != null) ? items.clone() : new int[0];
        this.inversions = 0;
    }

    private int[] combine(int[] leftPart, int[] rightPart) {
        int totalLen = leftPart.length + rightPart.length;
        int[] merged = new int[totalLen];
        int p1 = 0, p2 = 0, p3 = 0;
        while (p1 < leftPart.length && p2 < rightPart.length) {
            if (leftPart[p1] <= rightPart[p2]) {
                merged[p3++] = leftPart[p1++];
            } else {
                merged[p3++] = rightPart[p2++];
                this.inversions += (leftPart.length - p1);
            }
        }
        for (; p1 < leftPart.length; p1++) merged[p3++] = leftPart[p1];
        for (; p2 < rightPart.length; p2++) merged[p3++] = rightPart[p2];
        return merged;
    }

    private int[] divideAndSort(int[] seq) {
        if (seq.length <= 1) return seq;
        int mid = seq.length / 2;
        int[] l = new int[mid];
        int[] r = new int[seq.length - mid];
        System.arraycopy(seq, 0, l, 0, mid);
        System.arraycopy(seq, mid, r, 0, seq.length - mid);
        return combine(divideAndSort(l), divideAndSort(r));
    }

    public int[] executeSort() {
        if (this.data.length > 1) {
            this.data = divideAndSort(this.data);
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
