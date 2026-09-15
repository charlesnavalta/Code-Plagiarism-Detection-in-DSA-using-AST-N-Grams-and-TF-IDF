class Node_13 {
    int val_13;
    Node_13 lhs_13, rhs_13;
    public Node_13(int item) {
        val_13 = item;
        lhs_13 = rhs_13 = null;
    }
}
public class Tree_13 {
    public static void main(String[] args) {
        Tree_13 bst = new Tree_13();
        bst.ins_13(50);
        bst.srch_13(50);
    }
    Node_13 rt_13;
    public void ins_13(int val_13) {
        rt_13 = in_rec_13(rt_13, val_13);
    }
    Node_13 in_rec_13(Node_13 rt_13, int val_13) {
        if (rt_13 == null) return new Node_13(val_13);
        if (val_13 < rt_13.val_13) rt_13.lhs_13 = in_rec_13(rt_13.lhs_13, val_13);
        else if (val_13 > rt_13.val_13) rt_13.rhs_13 = in_rec_13(rt_13.rhs_13, val_13);
        return rt_13;
    }
    Node_13 srch_13(int val_13) {
        return sr_rec_13(rt_13, val_13);
    }
    Node_13 sr_rec_13(Node_13 rt_13, int val_13) {
        if (rt_13 == null || rt_13.val_13 == val_13) return rt_13;
        if (rt_13.val_13 < val_13) return sr_rec_13(rt_13.rhs_13, val_13);
        return sr_rec_13(rt_13.lhs_13, val_13);
    }
}