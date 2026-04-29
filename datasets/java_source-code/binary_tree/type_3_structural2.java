import java.util.ArrayList;
import java.util.Stack;

class TreeNode {
    int data;
    TreeNode left, right;

    public TreeNode(int data) {
        this.data = data;
        left = right = null;
    }
}

public class Main {

    public static ArrayList<Integer> inorderIterative(TreeNode root) {
        ArrayList<Integer> output = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;

        while (current != null || !stack.isEmpty()) {

            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            current = stack.pop();
            output.add(current.data);
            current = current.right;
        }

        return output;
    }

    public static void main(String[] args) {
        System.out.println("File executed");
    }
}