public class Sorter_7 {
    public static void main(String[] args) {
        int[] numList = {12, 11, 13, 5, 6, 7};
        new Sorter_7().heapSort(numList);
    }
    public void heapSort(int[] numList) {
        int total = numList.length;
        for (int idx = total / 2 - 1; idx >= 0; idx--) {
            siftDown(numList, total, idx);
        }
        for (int idx = total - 1; idx > 0; idx--) {
            int swapVal = numList[0];
            numList[0] = numList[idx];
            numList[idx] = swapVal;
            siftDown(numList, idx, 0);
        }
    }
    public void siftDown(int[] numList, int count, int parent) {
        int maxIdx = parent;
        int r = 2 * parent + 2;
        int l = 2 * parent + 1;
        if (r < count && numList[r] > numList[maxIdx]) maxIdx = r;
        if (l < count && numList[l] > numList[maxIdx]) maxIdx = l;
        if (maxIdx != parent) {
            int t = numList[parent];
            numList[parent] = numList[maxIdx];
            numList[maxIdx] = t;
            siftDown(numList, count, maxIdx);
        }
    }
}
