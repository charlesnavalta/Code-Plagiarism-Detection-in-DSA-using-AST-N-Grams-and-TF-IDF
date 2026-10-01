public class Sorter_4 {
    public static void main(String[] args) {
        int[] v = {12, 11, 13, 5, 6, 7};
        new Sorter_4().order(v);
    }
    private void exchange(int[] v, int i, int j) {
        int aux = v[i];
        v[i] = v[j];
        v[j] = aux;
    }
    public void order(int[] v) {
        int total = v.length;
        for (int p = total / 2 - 1; p >= 0; p--) {
            downheap(v, total, p);
        }
        for (int p = total - 1; p > 0; p--) {
            exchange(v, 0, p);
            downheap(v, p, 0);
        }
    }
    private void downheap(int[] v, int limit, int pos) {
        int leader = pos;
        int left = 2 * pos + 1;
        int right = 2 * pos + 2;
        if (right < limit && v[right] > v[leader]) leader = right;
        if (left < limit && v[left] > v[leader]) leader = left;
        if (leader != pos) {
            exchange(v, pos, leader);
            downheap(v, limit, leader);
        }
    }
}
