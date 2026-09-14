import java.util.LinkedList;
class Entry_3 {
    int k_3;
    String v_3;
    Entry_3(int k, String v) { k_3 = k; v_3 = v; }
}
public class Table_3 {
    public static void main(String[] args) {
        Table_3 ht = new Table_3();
        ht.ins_3(1, "one");
        ht.fetch_3(1);
    }
    LinkedList<Entry_3>[] bks_3 = new LinkedList[16];
    public Table_3() {
        for (int i = 0; i < 16; i++) bks_3[i] = new LinkedList<>();
    }
    public void ins_3(int k_3, String v_3) {
        int pos_3 = Math.abs(k_3) % 16;
        for (Entry_3 e : bks_3[pos_3]) {
            if (e.k_3 == k_3) { e.v_3 = v_3; return; }
        }
        bks_3[pos_3].add(new Entry_3(k_3, v_3));
    }
    public String fetch_3(int k_3) {
        int pos_3 = Math.abs(k_3) % 16;
        for (Entry_3 e : bks_3[pos_3]) {
            if (e.k_3 == k_3) return e.v_3;
        }
        return null;
    }
}