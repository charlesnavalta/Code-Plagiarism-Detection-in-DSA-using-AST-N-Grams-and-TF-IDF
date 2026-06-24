import java.util.ArrayList;

class Node {
    int value;
    Node left, right;

    public Node(int value) {
        this.value = value;
        left = right = null;
    }
}

public class original {

    // Inorder traversal that returns a list
    public static ArrayList<Integer> inorderTraversal(Node root) {
        ArrayList<Integer> result = new ArrayList<>();

        if (root == null) {
            return result;
        }

        result.addAll(inorderTraversal(root.left));
        result.add(root.value);
        result.addAll(inorderTraversal(root.right));

        return result;
    }

    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2);
        root.right = new Node(3);
        root.left.left = new Node(4);
        root.left.right = new Node(5);

        System.out.println(inorderTraversal(root));
    }
}