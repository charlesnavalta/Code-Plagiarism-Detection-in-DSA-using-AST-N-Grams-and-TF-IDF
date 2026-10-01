public class Sorter_8 {
    public static void main(String[] args) {
        int[] items = {12, 11, 13, 5, 6, 7};
        new Sorter_8().sort(items);
    }
    public void sort(int[] items) {
        int sz = items.length;
        int k = sz / 2 - 1;
        while (k >= 0) {
            adjust(items, sz, k);
            k--;
        }
        for (int i = sz - 1; i > 0; i--) {
            int tmp = items[0];
            items[0] = items[i];
            items[i] = tmp;
            adjust(items, i, 0);
        }
    }
    public void adjust(int[] items, int limit, int pos) {
        int largest = pos;
        int lc = 2 * pos + 1;
        int rc = 2 * pos + 2;
        if (lc < limit && items[lc] > items[largest]) largest = lc;
        if (rc < limit && items[rc] > items[largest]) largest = rc;
        if (largest != pos) {
            int temp = items[pos];
            items[pos] = items[largest];
            items[largest] = temp;
            adjust(items, limit, largest);
        }
    }
}
