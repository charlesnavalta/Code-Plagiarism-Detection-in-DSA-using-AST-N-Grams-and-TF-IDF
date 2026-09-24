class Node_8 {
    int val_8;
    Node_8 lhs_8, rhs_8;
    public Node_8(int item) {
        val_8 = item;
        lhs_8 = rhs_8 = null;
    }
}
public class Tree_8 {
    public static void main(String[] args) {
        Tree_8 bst = new Tree_8();
        bst.ins_8(50);
        bst.srch_8(50);
    }
    Node_8 rt_8;
    public void ins_8(int val_8) {
        rt_8 = in_rec_8(rt_8, val_8);
    }
    Node_8 in_rec_8(Node_8 rt_8, int val_8) {
        if (rt_8 == null) return new Node_8(val_8);
        if (val_8 < rt_8.val_8) rt_8.lhs_8 = in_rec_8(rt_8.lhs_8, val_8);
        else if (val_8 > rt_8.val_8) rt_8.rhs_8 = in_rec_8(rt_8.rhs_8, val_8);
        return rt_8;
    }
    Node_8 srch_8(int val_8) {
        return sr_rec_8(rt_8, val_8);
    }
    Node_8 sr_rec_8(Node_8 rt_8, int val_8) {
        if (rt_8 == null || rt_8.val_8 == val_8) return rt_8;
        if (rt_8.val_8 < val_8) return sr_rec_8(rt_8.rhs_8, val_8);
        return sr_rec_8(rt_8.lhs_8, val_8);
    }
}