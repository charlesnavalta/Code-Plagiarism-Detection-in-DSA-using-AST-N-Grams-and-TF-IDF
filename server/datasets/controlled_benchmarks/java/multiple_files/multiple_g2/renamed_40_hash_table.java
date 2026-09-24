import java.util.LinkedList;
class Entry_4 {
    int k_4;
    String v_4;
    Entry_4(int k, String v) { k_4 = k; v_4 = v; }
}
public class Table_4 {
    public static void main(String[] args) {
        Table_4 ht = new Table_4();
        ht.ins_4(1, "one");
        ht.fetch_4(1);
    }
    LinkedList<Entry_4>[] bks_4 = new LinkedList[16];
    public Table_4() {
        for (int i = 0; i < 16; i++) bks_4[i] = new LinkedList<>();
    }
    public void ins_4(int k_4, String v_4) {
        int pos_4 = Math.abs(k_4) % 16;
        for (Entry_4 e : bks_4[pos_4]) {
            if (e.k_4 == k_4) { e.v_4 = v_4; return; }
        }
        bks_4[pos_4].add(new Entry_4(k_4, v_4));
    }
    public String fetch_4(int k_4) {
        int pos_4 = Math.abs(k_4) % 16;
        for (Entry_4 e : bks_4[pos_4]) {
            if (e.k_4 == k_4) return e.v_4;
        }
        return null;
    }
}