import java.util.LinkedList;
class Entry_10 {
    int k_10;
    String v_10;
    Entry_10(int k, String v) { k_10 = k; v_10 = v; }
}
public class Table_10 {
    public static void main(String[] args) {
        Table_10 ht = new Table_10();
        ht.ins_10(1, "one");
        ht.fetch_10(1);
    }
    LinkedList<Entry_10>[] bks_10 = new LinkedList[16];
    public Table_10() {
        for (int i = 0; i < 16; i++) bks_10[i] = new LinkedList<>();
    }
    public void ins_10(int k_10, String v_10) {
        int pos_10 = Math.abs(k_10) % 16;
        for (Entry_10 e : bks_10[pos_10]) {
            if (e.k_10 == k_10) { e.v_10 = v_10; return; }
        }
        bks_10[pos_10].add(new Entry_10(k_10, v_10));
    }
    public String fetch_10(int k_10) {
        int pos_10 = Math.abs(k_10) % 16;
        for (Entry_10 e : bks_10[pos_10]) {
            if (e.k_10 == k_10) return e.v_10;
        }
        return null;
    }
}