public class Sorter_2 {
    public static void main(String[] args) {
        Sorter_2 s = new Sorter_2();
        int[] data = {12, 11, 13, 5, 6, 7};
        s.runSort(data);
    }
    public void runSort(int[] a) {
        int n = a.length;
        prepareHeap(a, n);
        int i = n - 1;
        while (i > 0) {
            int swapVal = a[i];
            a[i] = a[0];
            a[0] = swapVal;
            reheap(a, i, 0);
            i--;
        }
    }
    public void prepareHeap(int[] a, int n) {
        for (int k = (n - 2) / 2; k >= 0; k--) {
            reheap(a, n, k);
        }
    }
    public void reheap(int[] a, int bound, int cur) {
        int target = cur;
        int c1 = (cur << 1) + 1;
        int c2 = c1 + 1;
        if (c1 < bound && a[target] < a[c1]) target = c1;
        if (c2 < bound && a[target] < a[c2]) target = c2;
        if (target != cur) {
            int t = a[cur];
            a[cur] = a[target];
            a[target] = t;
            reheap(a, bound, target);
        }
    }
}
