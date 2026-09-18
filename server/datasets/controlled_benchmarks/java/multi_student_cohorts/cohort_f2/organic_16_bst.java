// Organic BST Student Submission 16
import java.util.Arrays;
public class ArrayBackedBST {
    private int[] tree = new int[64];
    private boolean[] occupied = new boolean[64];
    public void insert(int val) {
        int idx = 1;
        while (idx < tree.length && occupied[idx]) {
            if (val < tree[idx]) idx = 2 * idx;
            else if (val > tree[idx]) idx = 2 * idx + 1;
            else return;
        }
        if (idx < tree.length) {
            tree[idx] = val;
            occupied[idx] = true;
        }
    }
    public boolean search(int val) {
        int idx = 1;
        while (idx < tree.length && occupied[idx]) {
            if (tree[idx] == val) return true;
            idx = (val < tree[idx]) ? 2 * idx : 2 * idx + 1;
        }
        return false;
    }
}
