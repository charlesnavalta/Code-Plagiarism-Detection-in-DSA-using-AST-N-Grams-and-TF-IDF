import java.util.LinkedList;
class Entry_6 {
    int k_6;
    String v_6;
    Entry_6(int k, String v) { k_6 = k; v_6 = v; }
}
public class Table_6 {
    public static void main(String[] args) {
        Table_6 ht = new Table_6();
        ht.ins_6(1, "one");
        ht.fetch_6(1);
    }
    LinkedList<Entry_6>[] bks_6 = new LinkedList[16];
    public Table_6() {
        for (int i = 0; i < 16; i++) bks_6[i] = new LinkedList<>();
    }
    public void ins_6(int k_6, String v_6) {
        int pos_6 = Math.abs(k_6) % 16;
        for (Entry_6 e : bks_6[pos_6]) {
            if (e.k_6 == k_6) { e.v_6 = v_6; return; }
        }
        bks_6[pos_6].add(new Entry_6(k_6, v_6));
    }
    public String fetch_6(int k_6) {
        int pos_6 = Math.abs(k_6) % 16;
        for (Entry_6 e : bks_6[pos_6]) {
            if (e.k_6 == k_6) return e.v_6;
        }
        return null;
    }
}