import java.util.LinkedList;
class Entry_5 {
    int k_5;
    String v_5;
    Entry_5(int k, String v) { k_5 = k; v_5 = v; }
}
public class Table_5 {
    public static void main(String[] args) {
        Table_5 ht = new Table_5();
        ht.ins_5(1, "one");
        ht.fetch_5(1);
    }
    LinkedList<Entry_5>[] bks_5 = new LinkedList[16];
    public Table_5() {
        for (int i = 0; i < 16; i++) bks_5[i] = new LinkedList<>();
    }
    public void ins_5(int k_5, String v_5) {
        int pos_5 = Math.abs(k_5) % 16;
        for (Entry_5 e : bks_5[pos_5]) {
            if (e.k_5 == k_5) { e.v_5 = v_5; return; }
        }
        bks_5[pos_5].add(new Entry_5(k_5, v_5));
    }
    public String fetch_5(int k_5) {
        int pos_5 = Math.abs(k_5) % 16;
        for (Entry_5 e : bks_5[pos_5]) {
            if (e.k_5 == k_5) return e.v_5;
        }
        return null;
    }
}