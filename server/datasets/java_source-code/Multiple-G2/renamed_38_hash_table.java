import java.util.LinkedList;
class Entry_2 {
    int k_2;
    String v_2;
    Entry_2(int k, String v) { k_2 = k; v_2 = v; }
}
public class Table_2 {
    public static void main(String[] args) {
        Table_2 ht = new Table_2();
        ht.ins_2(1, "one");
        ht.fetch_2(1);
    }
    LinkedList<Entry_2>[] bks_2 = new LinkedList[16];
    public Table_2() {
        for (int i = 0; i < 16; i++) bks_2[i] = new LinkedList<>();
    }
    public void ins_2(int k_2, String v_2) {
        int pos_2 = Math.abs(k_2) % 16;
        for (Entry_2 e : bks_2[pos_2]) {
            if (e.k_2 == k_2) { e.v_2 = v_2; return; }
        }
        bks_2[pos_2].add(new Entry_2(k_2, v_2));
    }
    public String fetch_2(int k_2) {
        int pos_2 = Math.abs(k_2) % 16;
        for (Entry_2 e : bks_2[pos_2]) {
            if (e.k_2 == k_2) return e.v_2;
        }
        return null;
    }
}