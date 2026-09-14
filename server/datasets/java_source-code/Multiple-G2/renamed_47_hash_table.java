import java.util.LinkedList;
class Entry_11 {
    int k_11;
    String v_11;
    Entry_11(int k, String v) { k_11 = k; v_11 = v; }
}
public class Table_11 {
    public static void main(String[] args) {
        Table_11 ht = new Table_11();
        ht.ins_11(1, "one");
        ht.fetch_11(1);
    }
    LinkedList<Entry_11>[] bks_11 = new LinkedList[16];
    public Table_11() {
        for (int i = 0; i < 16; i++) bks_11[i] = new LinkedList<>();
    }
    public void ins_11(int k_11, String v_11) {
        int pos_11 = Math.abs(k_11) % 16;
        for (Entry_11 e : bks_11[pos_11]) {
            if (e.k_11 == k_11) { e.v_11 = v_11; return; }
        }
        bks_11[pos_11].add(new Entry_11(k_11, v_11));
    }
    public String fetch_11(int k_11) {
        int pos_11 = Math.abs(k_11) % 16;
        for (Entry_11 e : bks_11[pos_11]) {
            if (e.k_11 == k_11) return e.v_11;
        }
        return null;
    }
}