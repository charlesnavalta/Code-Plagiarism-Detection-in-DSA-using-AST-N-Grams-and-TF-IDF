class Node_11 {
    int val_11;
    Node_11 lhs_11, rhs_11;
    public Node_11(int item) {
        val_11 = item;
        lhs_11 = rhs_11 = null;
    }
}
public class Tree_11 {
    public static void main(String[] args) {
        Tree_11 bst = new Tree_11();
        bst.ins_11(50);
        bst.srch_11(50);
    }
    Node_11 rt_11;
    public void ins_11(int val_11) {
        rt_11 = in_rec_11(rt_11, val_11);
    }
    Node_11 in_rec_11(Node_11 rt_11, int val_11) {
        if (rt_11 == null) return new Node_11(val_11);
        if (val_11 < rt_11.val_11) rt_11.lhs_11 = in_rec_11(rt_11.lhs_11, val_11);
        else if (val_11 > rt_11.val_11) rt_11.rhs_11 = in_rec_11(rt_11.rhs_11, val_11);
        return rt_11;
    }
    Node_11 srch_11(int val_11) {
        return sr_rec_11(rt_11, val_11);
    }
    Node_11 sr_rec_11(Node_11 rt_11, int val_11) {
        if (rt_11 == null || rt_11.val_11 == val_11) return rt_11;
        if (rt_11.val_11 < val_11) return sr_rec_11(rt_11.rhs_11, val_11);
        return sr_rec_11(rt_11.lhs_11, val_11);
    }
}