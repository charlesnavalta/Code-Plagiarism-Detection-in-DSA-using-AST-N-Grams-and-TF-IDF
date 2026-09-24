class Node_12 {
    int val_12;
    Node_12 lhs_12, rhs_12;
    public Node_12(int item) {
        val_12 = item;
        lhs_12 = rhs_12 = null;
    }
}
public class Tree_12 {
    public static void main(String[] args) {
        Tree_12 bst = new Tree_12();
        bst.ins_12(50);
        bst.srch_12(50);
    }
    Node_12 rt_12;
    public void ins_12(int val_12) {
        rt_12 = in_rec_12(rt_12, val_12);
    }
    Node_12 in_rec_12(Node_12 rt_12, int val_12) {
        if (rt_12 == null) return new Node_12(val_12);
        if (val_12 < rt_12.val_12) rt_12.lhs_12 = in_rec_12(rt_12.lhs_12, val_12);
        else if (val_12 > rt_12.val_12) rt_12.rhs_12 = in_rec_12(rt_12.rhs_12, val_12);
        return rt_12;
    }
    Node_12 srch_12(int val_12) {
        return sr_rec_12(rt_12, val_12);
    }
    Node_12 sr_rec_12(Node_12 rt_12, int val_12) {
        if (rt_12 == null || rt_12.val_12 == val_12) return rt_12;
        if (rt_12.val_12 < val_12) return sr_rec_12(rt_12.rhs_12, val_12);
        return sr_rec_12(rt_12.lhs_12, val_12);
    }
}