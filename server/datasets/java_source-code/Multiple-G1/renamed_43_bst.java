class Node_7 {
    int val_7;
    Node_7 lhs_7, rhs_7;
    public Node_7(int item) {
        val_7 = item;
        lhs_7 = rhs_7 = null;
    }
}
public class Tree_7 {
    public static void main(String[] args) {
        Tree_7 bst = new Tree_7();
        bst.ins_7(50);
        bst.srch_7(50);
    }
    Node_7 rt_7;
    public void ins_7(int val_7) {
        rt_7 = in_rec_7(rt_7, val_7);
    }
    Node_7 in_rec_7(Node_7 rt_7, int val_7) {
        if (rt_7 == null) return new Node_7(val_7);
        if (val_7 < rt_7.val_7) rt_7.lhs_7 = in_rec_7(rt_7.lhs_7, val_7);
        else if (val_7 > rt_7.val_7) rt_7.rhs_7 = in_rec_7(rt_7.rhs_7, val_7);
        return rt_7;
    }
    Node_7 srch_7(int val_7) {
        return sr_rec_7(rt_7, val_7);
    }
    Node_7 sr_rec_7(Node_7 rt_7, int val_7) {
        if (rt_7 == null || rt_7.val_7 == val_7) return rt_7;
        if (rt_7.val_7 < val_7) return sr_rec_7(rt_7.rhs_7, val_7);
        return sr_rec_7(rt_7.lhs_7, val_7);
    }
}