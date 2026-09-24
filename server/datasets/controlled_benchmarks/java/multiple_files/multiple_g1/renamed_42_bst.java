class Node_6 {
    int val_6;
    Node_6 lhs_6, rhs_6;
    public Node_6(int item) {
        val_6 = item;
        lhs_6 = rhs_6 = null;
    }
}
public class Tree_6 {
    public static void main(String[] args) {
        Tree_6 bst = new Tree_6();
        bst.ins_6(50);
        bst.srch_6(50);
    }
    Node_6 rt_6;
    public void ins_6(int val_6) {
        rt_6 = in_rec_6(rt_6, val_6);
    }
    Node_6 in_rec_6(Node_6 rt_6, int val_6) {
        if (rt_6 == null) return new Node_6(val_6);
        if (val_6 < rt_6.val_6) rt_6.lhs_6 = in_rec_6(rt_6.lhs_6, val_6);
        else if (val_6 > rt_6.val_6) rt_6.rhs_6 = in_rec_6(rt_6.rhs_6, val_6);
        return rt_6;
    }
    Node_6 srch_6(int val_6) {
        return sr_rec_6(rt_6, val_6);
    }
    Node_6 sr_rec_6(Node_6 rt_6, int val_6) {
        if (rt_6 == null || rt_6.val_6 == val_6) return rt_6;
        if (rt_6.val_6 < val_6) return sr_rec_6(rt_6.rhs_6, val_6);
        return sr_rec_6(rt_6.lhs_6, val_6);
    }
}