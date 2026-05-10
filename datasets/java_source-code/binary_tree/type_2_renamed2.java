import java.util.ArrayList;

class Node {
    int x;
    Node left, right;

    public Node(int x) {
        this.x = x;
        left = right = null;
    }
}

public class Main {

    public static ArrayList<Integer> inorder(Node node) {
        ArrayList<Integer> values = new ArrayList<>();

        if (node == null) {
            return values;
        }

        values.addAll(inorder(node.left));
        values.add(node.x);
        values.addAll(inorder(node.right));

        return values;
    }

    public static void main(String[] args) {
        System.out.println("File executed");
    }
}