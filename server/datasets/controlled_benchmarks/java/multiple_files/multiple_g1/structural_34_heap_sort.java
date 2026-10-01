public class Sorter_9 {
    public static void main(String[] args) {
        int[] buffer = {12, 11, 13, 5, 6, 7};
        new Sorter_9().heapSort(buffer);
    }
    public void heapSort(int[] buffer) {
        int len = buffer.length;
        for (int p = len / 2 - 1; p >= 0; p--) {
            sift(buffer, len, p);
        }
        for (int p = len - 1; p > 0; p--) {
            swap(buffer, 0, p);
            sift(buffer, p, 0);
        }
    }
    public void swap(int[] buf, int a, int b) {
        int aux = buf[a];
        buf[a] = buf[b];
        buf[b] = aux;
    }
    public void sift(int[] buf, int limit, int i) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left >= limit) return;
        int winner = (right < limit && buf[right] > buf[left]) ? right : left;
        if (buf[winner] > buf[i]) {
            swap(buf, i, winner);
            sift(buf, limit, winner);
        }
    }
}
