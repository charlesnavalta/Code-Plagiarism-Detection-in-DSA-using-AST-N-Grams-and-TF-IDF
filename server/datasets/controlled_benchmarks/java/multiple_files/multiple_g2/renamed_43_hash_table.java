import java.util.LinkedList;
class Entry_7 {
    int k_7;
    String v_7;
    Entry_7(int k, String v) { k_7 = k; v_7 = v; }
}
public class Table_7 {
    public static void main(String[] args) {
        Table_7 ht = new Table_7();
        ht.ins_7(1, "one");
        ht.fetch_7(1);
    }
    LinkedList<Entry_7>[] bks_7 = new LinkedList[16];
    public Table_7() {
        for (int i = 0; i < 16; i++) bks_7[i] = new LinkedList<>();
    }
    public void ins_7(int k_7, String v_7) {
        int pos_7 = Math.abs(k_7) % 16;
        for (Entry_7 e : bks_7[pos_7]) {
            if (e.k_7 == k_7) { e.v_7 = v_7; return; }
        }
        bks_7[pos_7].add(new Entry_7(k_7, v_7));
    }
    public String fetch_7(int k_7) {
        int pos_7 = Math.abs(k_7) % 16;
        for (Entry_7 e : bks_7[pos_7]) {
            if (e.k_7 == k_7) return e.v_7;
        }
        return null;
    }
}