public class Sorter_3 {
    public static void main(String[] args) {
        int[] seq = {12, 11, 13, 5, 6, 7};
        new Sorter_3().sort(seq);
    }
    public void sort(int[] seq) {
        int sz = seq.length;
        for (int i = sz / 2 - 1; i >= 0; i--) {
            sink(seq, sz, i);
        }
        for (int i = sz - 1; i > 0; i--) {
            int tmp = seq[0];
            seq[0] = seq[i];
            seq[i] = tmp;
            sink(seq, i, 0);
        }
    }
    public void sink(int[] seq, int n, int idx) {
        int curr = idx;
        while (true) {
            int maxNode = curr;
            int l = 2 * curr + 1;
            int r = 2 * curr + 2;
            if (l < n && seq[l] > seq[maxNode]) maxNode = l;
            if (r < n && seq[r] > seq[maxNode]) maxNode = r;
            if (maxNode == curr) break;
            int t = seq[curr];
            seq[curr] = seq[maxNode];
            seq[maxNode] = t;
            curr = maxNode;
        }
    }
}
