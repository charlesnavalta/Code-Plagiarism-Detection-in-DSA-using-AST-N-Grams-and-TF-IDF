import java.util.LinkedList;
class Entry_1 {
    int k_1;
    String v_1;
    Entry_1(int k, String v) { k_1 = k; v_1 = v; }
}
public class Table_1 {
    public static void main(String[] args) {
        Table_1 ht = new Table_1();
        ht.ins_1(1, "one");
        ht.fetch_1(1);
    }
    LinkedList<Entry_1>[] bks_1 = new LinkedList[16];
    public Table_1() {
        for (int i = 0; i < 16; i++) bks_1[i] = new LinkedList<>();
    }
    public void ins_1(int k_1, String v_1) {
        int pos_1 = Math.abs(k_1) % 16;
        for (Entry_1 e : bks_1[pos_1]) {
            if (e.k_1 == k_1) { e.v_1 = v_1; return; }
        }
        bks_1[pos_1].add(new Entry_1(k_1, v_1));
    }
    public String fetch_1(int k_1) {
        int pos_1 = Math.abs(k_1) % 16;
        for (Entry_1 e : bks_1[pos_1]) {
            if (e.k_1 == k_1) return e.v_1;
        }
        return null;
    }
}