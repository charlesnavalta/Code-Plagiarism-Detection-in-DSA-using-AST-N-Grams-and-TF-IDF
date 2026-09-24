import java.util.LinkedList;
class Entry_0 {
    int k_0;
    String v_0;
    Entry_0(int k, String v) { k_0 = k; v_0 = v; }
}
public class Table_0 {
    public static void main(String[] args) {
        Table_0 ht = new Table_0();
        ht.ins_0(1, "one");
        ht.fetch_0(1);
    }
    LinkedList<Entry_0>[] bks_0 = new LinkedList[16];
    public Table_0() {
        for (int i = 0; i < 16; i++) bks_0[i] = new LinkedList<>();
    }
    public void ins_0(int k_0, String v_0) {
        int pos_0 = Math.abs(k_0) % 16;
        for (Entry_0 e : bks_0[pos_0]) {
            if (e.k_0 == k_0) { e.v_0 = v_0; return; }
        }
        bks_0[pos_0].add(new Entry_0(k_0, v_0));
    }
    public String fetch_0(int k_0) {
        int pos_0 = Math.abs(k_0) % 16;
        for (Entry_0 e : bks_0[pos_0]) {
            if (e.k_0 == k_0) return e.v_0;
        }
        return null;
    }
}