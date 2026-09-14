import java.util.LinkedList;
class Entry_12 {
    int k_12;
    String v_12;
    Entry_12(int k, String v) { k_12 = k; v_12 = v; }
}
public class Table_12 {
    public static void main(String[] args) {
        Table_12 ht = new Table_12();
        ht.ins_12(1, "one");
        ht.fetch_12(1);
    }
    LinkedList<Entry_12>[] bks_12 = new LinkedList[16];
    public Table_12() {
        for (int i = 0; i < 16; i++) bks_12[i] = new LinkedList<>();
    }
    public void ins_12(int k_12, String v_12) {
        int pos_12 = Math.abs(k_12) % 16;
        for (Entry_12 e : bks_12[pos_12]) {
            if (e.k_12 == k_12) { e.v_12 = v_12; return; }
        }
        bks_12[pos_12].add(new Entry_12(k_12, v_12));
    }
    public String fetch_12(int k_12) {
        int pos_12 = Math.abs(k_12) % 16;
        for (Entry_12 e : bks_12[pos_12]) {
            if (e.k_12 == k_12) return e.v_12;
        }
        return null;
    }
}