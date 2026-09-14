import java.util.LinkedList;
class Entry_8 {
    int k_8;
    String v_8;
    Entry_8(int k, String v) { k_8 = k; v_8 = v; }
}
public class Table_8 {
    public static void main(String[] args) {
        Table_8 ht = new Table_8();
        ht.ins_8(1, "one");
        ht.fetch_8(1);
    }
    LinkedList<Entry_8>[] bks_8 = new LinkedList[16];
    public Table_8() {
        for (int i = 0; i < 16; i++) bks_8[i] = new LinkedList<>();
    }
    public void ins_8(int k_8, String v_8) {
        int pos_8 = Math.abs(k_8) % 16;
        for (Entry_8 e : bks_8[pos_8]) {
            if (e.k_8 == k_8) { e.v_8 = v_8; return; }
        }
        bks_8[pos_8].add(new Entry_8(k_8, v_8));
    }
    public String fetch_8(int k_8) {
        int pos_8 = Math.abs(k_8) % 16;
        for (Entry_8 e : bks_8[pos_8]) {
            if (e.k_8 == k_8) return e.v_8;
        }
        return null;
    }
}