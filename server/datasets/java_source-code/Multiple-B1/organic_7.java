// Binary Tree Traversal - organic submission 7
// Iterative pre-order, OOP style with running node count.

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

class Node {
    int val;
    Node left;
    Node right;

    public Node(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    Node root;
    int size;

    public Tree() {
        this.root = null;
        this.size = 0;
    }

    public void insert(int val) {
        this.size++;
        this.root = insertRec(this.root, val);
    }

    private Node insertRec(Node node, int val) {
        if (node == null) {
            return new Node(val);
        }
        if (val < node.val) {
            node.left = insertRec(node.left, val);
        } else {
            node.right = insertRec(node.right, val);
        }
        return node;
    }

    public List<Integer> preorderIterative() {
        if (this.root == null) {
            return new ArrayList<>();
        }
        List<Integer> result = new ArrayList<>();
        Stack<Node> stack = new Stack<>();
        stack.push(this.root);
        while (!stack.isEmpty()) {
            Node node = stack.pop();
            result.add(node.val);
            if (node.right != null) {
                stack.push(node.right);
            }
            if (node.left != null) {
                stack.push(node.left);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        Tree t = new Tree();
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            t.insert(v);
        }
        System.out.println("tree size: " + t.size);
        System.out.println("Pre-order (iterative): " + t.preorderIterative());
    }
}
