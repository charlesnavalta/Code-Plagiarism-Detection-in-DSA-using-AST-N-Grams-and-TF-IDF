class Node_9 {
    int val_9;
    Node_9 lhs_9, rhs_9;
    public Node_9(int item) {
        val_9 = item;
        lhs_9 = rhs_9 = null;
    }
}
public class Tree_9 {
    public static void main(String[] args) {
        Tree_9 bst = new Tree_9();
        bst.ins_9(50);
        bst.srch_9(50);
    }
    Node_9 rt_9;
    public void ins_9(int val_9) {
        rt_9 = in_rec_9(rt_9, val_9);
    }
    Node_9 in_rec_9(Node_9 rt_9, int val_9) {
        if (rt_9 == null) return new Node_9(val_9);
        if (val_9 < rt_9.val_9) rt_9.lhs_9 = in_rec_9(rt_9.lhs_9, val_9);
        else if (val_9 > rt_9.val_9) rt_9.rhs_9 = in_rec_9(rt_9.rhs_9, val_9);
        return rt_9;
    }
    Node_9 srch_9(int val_9) {
        return sr_rec_9(rt_9, val_9);
    }
    Node_9 sr_rec_9(Node_9 rt_9, int val_9) {
        if (rt_9 == null || rt_9.val_9 == val_9) return rt_9;
        if (rt_9.val_9 < val_9) return sr_rec_9(rt_9.rhs_9, val_9);
        return sr_rec_9(rt_9.lhs_9, val_9);
    }
}