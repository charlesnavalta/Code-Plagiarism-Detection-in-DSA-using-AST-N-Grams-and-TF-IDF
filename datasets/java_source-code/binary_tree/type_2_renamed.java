import java.util.ArrayList;

class TreeElement {
    int data;
    TreeElement left_child, right_child;

    public TreeElement(int data) {
        this.data = data;
        left_child = right_child = null;
    }
}

public class Main {

    public static ArrayList<Integer> inorderWalk(TreeElement currentNode) {
        ArrayList<Integer> output = new ArrayList<>();

        if (currentNode == null) {
            return output;
        }

        output.addAll(inorderWalk(currentNode.left_child));
        output.add(currentNode.data);
        output.addAll(inorderWalk(currentNode.right_child));

        return output;
    }

    public static void main(String[] args) {
        TreeElement mainRoot = new TreeElement(1);
        mainRoot.left_child = new TreeElement(2);
        mainRoot.right_child = new TreeElement(3);
        mainRoot.left_child.left_child = new TreeElement(4);
        mainRoot.left_child.right_child = new TreeElement(5);

        System.out.println(inorderWalk(mainRoot));
    }
}