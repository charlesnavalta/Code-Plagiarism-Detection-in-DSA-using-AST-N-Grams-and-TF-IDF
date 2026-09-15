// Student 4 Merge Sort
public class MergeSorter {
    public static void main(String[] args) {
        MergeSorter ms = new MergeSorter();
        int[] data = {5, 2, 8, 1, 9};
        ms.divideAndConquer(data, 0, data.length - 1);
    }
    public void mergeSegments(int[] data, int p, int q, int r) {
        int[] sub1 = new int[q - p + 1];
        int[] sub2 = new int[r - q];
        for (int i = 0; i < sub1.length; i++) sub1[i] = data[p + i];
        for (int j = 0; j < sub2.length; j++) sub2[j] = data[q + 1 + j];
        int i = 0, j = 0, k = p;
        while (i < sub1.length && j < sub2.length) {
            if (sub1[i] <= sub2[j]) {
                data[k++] = sub1[i++];
            } else {
                data[k++] = sub2[j++];
            }
        }
        while (i < sub1.length) data[k++] = sub1[i++];
        while (j < sub2.length) data[k++] = sub2[j++];
    }
    public void divideAndConquer(int[] data, int p, int r) {
        if (p < r) {
            int mid = (p + r) / 2;
            divideAndConquer(data, p, mid);
            divideAndConquer(data, mid + 1, r);
            mergeSegments(data, p, mid, r);
        }
    }
}
// End 4
