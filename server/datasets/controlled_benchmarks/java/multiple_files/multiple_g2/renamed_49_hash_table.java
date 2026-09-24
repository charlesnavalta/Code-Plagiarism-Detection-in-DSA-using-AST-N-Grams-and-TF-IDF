import java.util.LinkedList;
class Entry_13 {
    int k_13;
    String v_13;
    Entry_13(int k, String v) { k_13 = k; v_13 = v; }
}
public class Table_13 {
    public static void main(String[] args) {
        Table_13 ht = new Table_13();
        ht.ins_13(1, "one");
        ht.fetch_13(1);
    }
    LinkedList<Entry_13>[] bks_13 = new LinkedList[16];
    public Table_13() {
        for (int i = 0; i < 16; i++) bks_13[i] = new LinkedList<>();
    }
    public void ins_13(int k_13, String v_13) {
        int pos_13 = Math.abs(k_13) % 16;
        for (Entry_13 e : bks_13[pos_13]) {
            if (e.k_13 == k_13) { e.v_13 = v_13; return; }
        }
        bks_13[pos_13].add(new Entry_13(k_13, v_13));
    }
    public String fetch_13(int k_13) {
        int pos_13 = Math.abs(k_13) % 16;
        for (Entry_13 e : bks_13[pos_13]) {
            if (e.k_13 == k_13) return e.v_13;
        }
        return null;
    }
}