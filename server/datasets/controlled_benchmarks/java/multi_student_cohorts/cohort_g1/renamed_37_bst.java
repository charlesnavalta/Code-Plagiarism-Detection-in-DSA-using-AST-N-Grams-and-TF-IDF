class Node_1 {
    int val_1;
    Node_1 lhs_1, rhs_1;
    public Node_1(int item) {
        val_1 = item;
        lhs_1 = rhs_1 = null;
    }
}
public class Tree_1 {
    public static void main(String[] args) {
        Tree_1 bst = new Tree_1();
        bst.ins_1(50);
        bst.srch_1(50);
    }
    Node_1 rt_1;
    public void ins_1(int val_1) {
        rt_1 = in_rec_1(rt_1, val_1);
    }
    Node_1 in_rec_1(Node_1 rt_1, int val_1) {
        if (rt_1 == null) return new Node_1(val_1);
        if (val_1 < rt_1.val_1) rt_1.lhs_1 = in_rec_1(rt_1.lhs_1, val_1);
        else if (val_1 > rt_1.val_1) rt_1.rhs_1 = in_rec_1(rt_1.rhs_1, val_1);
        return rt_1;
    }
    Node_1 srch_1(int val_1) {
        return sr_rec_1(rt_1, val_1);
    }
    Node_1 sr_rec_1(Node_1 rt_1, int val_1) {
        if (rt_1 == null || rt_1.val_1 == val_1) return rt_1;
        if (rt_1.val_1 < val_1) return sr_rec_1(rt_1.rhs_1, val_1);
        return sr_rec_1(rt_1.lhs_1, val_1);
    }
}