class Node_0 {
    int val_0;
    Node_0 lhs_0, rhs_0;
    public Node_0(int item) {
        val_0 = item;
        lhs_0 = rhs_0 = null;
    }
}
public class Tree_0 {
    public static void main(String[] args) {
        Tree_0 bst = new Tree_0();
        bst.ins_0(50);
        bst.srch_0(50);
    }
    Node_0 rt_0;
    public void ins_0(int val_0) {
        rt_0 = in_rec_0(rt_0, val_0);
    }
    Node_0 in_rec_0(Node_0 rt_0, int val_0) {
        if (rt_0 == null) return new Node_0(val_0);
        if (val_0 < rt_0.val_0) rt_0.lhs_0 = in_rec_0(rt_0.lhs_0, val_0);
        else if (val_0 > rt_0.val_0) rt_0.rhs_0 = in_rec_0(rt_0.rhs_0, val_0);
        return rt_0;
    }
    Node_0 srch_0(int val_0) {
        return sr_rec_0(rt_0, val_0);
    }
    Node_0 sr_rec_0(Node_0 rt_0, int val_0) {
        if (rt_0 == null || rt_0.val_0 == val_0) return rt_0;
        if (rt_0.val_0 < val_0) return sr_rec_0(rt_0.rhs_0, val_0);
        return sr_rec_0(rt_0.lhs_0, val_0);
    }
}