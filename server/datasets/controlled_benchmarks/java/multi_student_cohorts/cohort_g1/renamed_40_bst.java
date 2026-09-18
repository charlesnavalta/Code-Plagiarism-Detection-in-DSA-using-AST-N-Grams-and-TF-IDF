class Node_4 {
    int val_4;
    Node_4 lhs_4, rhs_4;
    public Node_4(int item) {
        val_4 = item;
        lhs_4 = rhs_4 = null;
    }
}
public class Tree_4 {
    public static void main(String[] args) {
        Tree_4 bst = new Tree_4();
        bst.ins_4(50);
        bst.srch_4(50);
    }
    Node_4 rt_4;
    public void ins_4(int val_4) {
        rt_4 = in_rec_4(rt_4, val_4);
    }
    Node_4 in_rec_4(Node_4 rt_4, int val_4) {
        if (rt_4 == null) return new Node_4(val_4);
        if (val_4 < rt_4.val_4) rt_4.lhs_4 = in_rec_4(rt_4.lhs_4, val_4);
        else if (val_4 > rt_4.val_4) rt_4.rhs_4 = in_rec_4(rt_4.rhs_4, val_4);
        return rt_4;
    }
    Node_4 srch_4(int val_4) {
        return sr_rec_4(rt_4, val_4);
    }
    Node_4 sr_rec_4(Node_4 rt_4, int val_4) {
        if (rt_4 == null || rt_4.val_4 == val_4) return rt_4;
        if (rt_4.val_4 < val_4) return sr_rec_4(rt_4.rhs_4, val_4);
        return sr_rec_4(rt_4.lhs_4, val_4);
    }
}