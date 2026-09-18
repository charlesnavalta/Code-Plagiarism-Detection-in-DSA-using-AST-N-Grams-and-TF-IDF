class Node_5 {
    int val_5;
    Node_5 lhs_5, rhs_5;
    public Node_5(int item) {
        val_5 = item;
        lhs_5 = rhs_5 = null;
    }
}
public class Tree_5 {
    public static void main(String[] args) {
        Tree_5 bst = new Tree_5();
        bst.ins_5(50);
        bst.srch_5(50);
    }
    Node_5 rt_5;
    public void ins_5(int val_5) {
        rt_5 = in_rec_5(rt_5, val_5);
    }
    Node_5 in_rec_5(Node_5 rt_5, int val_5) {
        if (rt_5 == null) return new Node_5(val_5);
        if (val_5 < rt_5.val_5) rt_5.lhs_5 = in_rec_5(rt_5.lhs_5, val_5);
        else if (val_5 > rt_5.val_5) rt_5.rhs_5 = in_rec_5(rt_5.rhs_5, val_5);
        return rt_5;
    }
    Node_5 srch_5(int val_5) {
        return sr_rec_5(rt_5, val_5);
    }
    Node_5 sr_rec_5(Node_5 rt_5, int val_5) {
        if (rt_5 == null || rt_5.val_5 == val_5) return rt_5;
        if (rt_5.val_5 < val_5) return sr_rec_5(rt_5.rhs_5, val_5);
        return sr_rec_5(rt_5.lhs_5, val_5);
    }
}