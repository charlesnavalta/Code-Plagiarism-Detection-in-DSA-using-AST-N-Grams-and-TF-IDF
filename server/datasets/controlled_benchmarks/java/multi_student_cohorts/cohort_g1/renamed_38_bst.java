class Node_2 {
    int val_2;
    Node_2 lhs_2, rhs_2;
    public Node_2(int item) {
        val_2 = item;
        lhs_2 = rhs_2 = null;
    }
}
public class Tree_2 {
    public static void main(String[] args) {
        Tree_2 bst = new Tree_2();
        bst.ins_2(50);
        bst.srch_2(50);
    }
    Node_2 rt_2;
    public void ins_2(int val_2) {
        rt_2 = in_rec_2(rt_2, val_2);
    }
    Node_2 in_rec_2(Node_2 rt_2, int val_2) {
        if (rt_2 == null) return new Node_2(val_2);
        if (val_2 < rt_2.val_2) rt_2.lhs_2 = in_rec_2(rt_2.lhs_2, val_2);
        else if (val_2 > rt_2.val_2) rt_2.rhs_2 = in_rec_2(rt_2.rhs_2, val_2);
        return rt_2;
    }
    Node_2 srch_2(int val_2) {
        return sr_rec_2(rt_2, val_2);
    }
    Node_2 sr_rec_2(Node_2 rt_2, int val_2) {
        if (rt_2 == null || rt_2.val_2 == val_2) return rt_2;
        if (rt_2.val_2 < val_2) return sr_rec_2(rt_2.rhs_2, val_2);
        return sr_rec_2(rt_2.lhs_2, val_2);
    }
}