import java.util.LinkedList;
class Entry_9 {
    int k_9;
    String v_9;
    Entry_9(int k, String v) { k_9 = k; v_9 = v; }
}
public class Table_9 {
    public static void main(String[] args) {
        Table_9 ht = new Table_9();
        ht.ins_9(1, "one");
        ht.fetch_9(1);
    }
    LinkedList<Entry_9>[] bks_9 = new LinkedList[16];
    public Table_9() {
        for (int i = 0; i < 16; i++) bks_9[i] = new LinkedList<>();
    }
    public void ins_9(int k_9, String v_9) {
        int pos_9 = Math.abs(k_9) % 16;
        for (Entry_9 e : bks_9[pos_9]) {
            if (e.k_9 == k_9) { e.v_9 = v_9; return; }
        }
        bks_9[pos_9].add(new Entry_9(k_9, v_9));
    }
    public String fetch_9(int k_9) {
        int pos_9 = Math.abs(k_9) % 16;
        for (Entry_9 e : bks_9[pos_9]) {
            if (e.k_9 == k_9) return e.v_9;
        }
        return null;
    }
}