class Node_10 {
    int val_10;
    Node_10 lhs_10, rhs_10;
    public Node_10(int item) {
        val_10 = item;
        lhs_10 = rhs_10 = null;
    }
}
public class Tree_10 {
    public static void main(String[] args) {
        Tree_10 bst = new Tree_10();
        bst.ins_10(50);
        bst.srch_10(50);
    }
    Node_10 rt_10;
    public void ins_10(int val_10) {
        rt_10 = in_rec_10(rt_10, val_10);
    }
    Node_10 in_rec_10(Node_10 rt_10, int val_10) {
        if (rt_10 == null) return new Node_10(val_10);
        if (val_10 < rt_10.val_10) rt_10.lhs_10 = in_rec_10(rt_10.lhs_10, val_10);
        else if (val_10 > rt_10.val_10) rt_10.rhs_10 = in_rec_10(rt_10.rhs_10, val_10);
        return rt_10;
    }
    Node_10 srch_10(int val_10) {
        return sr_rec_10(rt_10, val_10);
    }
    Node_10 sr_rec_10(Node_10 rt_10, int val_10) {
        if (rt_10 == null || rt_10.val_10 == val_10) return rt_10;
        if (rt_10.val_10 < val_10) return sr_rec_10(rt_10.rhs_10, val_10);
        return sr_rec_10(rt_10.lhs_10, val_10);
    }
}