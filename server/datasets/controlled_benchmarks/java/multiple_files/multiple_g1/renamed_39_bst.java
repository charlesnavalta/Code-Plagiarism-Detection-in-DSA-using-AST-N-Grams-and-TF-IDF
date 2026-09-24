class Node_3 {
    int val_3;
    Node_3 lhs_3, rhs_3;
    public Node_3(int item) {
        val_3 = item;
        lhs_3 = rhs_3 = null;
    }
}
public class Tree_3 {
    public static void main(String[] args) {
        Tree_3 bst = new Tree_3();
        bst.ins_3(50);
        bst.srch_3(50);
    }
    Node_3 rt_3;
    public void ins_3(int val_3) {
        rt_3 = in_rec_3(rt_3, val_3);
    }
    Node_3 in_rec_3(Node_3 rt_3, int val_3) {
        if (rt_3 == null) return new Node_3(val_3);
        if (val_3 < rt_3.val_3) rt_3.lhs_3 = in_rec_3(rt_3.lhs_3, val_3);
        else if (val_3 > rt_3.val_3) rt_3.rhs_3 = in_rec_3(rt_3.rhs_3, val_3);
        return rt_3;
    }
    Node_3 srch_3(int val_3) {
        return sr_rec_3(rt_3, val_3);
    }
    Node_3 sr_rec_3(Node_3 rt_3, int val_3) {
        if (rt_3 == null || rt_3.val_3 == val_3) return rt_3;
        if (rt_3.val_3 < val_3) return sr_rec_3(rt_3.rhs_3, val_3);
        return sr_rec_3(rt_3.lhs_3, val_3);
    }
}