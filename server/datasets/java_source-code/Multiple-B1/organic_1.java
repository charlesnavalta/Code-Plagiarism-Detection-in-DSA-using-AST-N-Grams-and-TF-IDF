// Binary Tree Traversal - organic submission 1
// Recursive pre-order, class-based BinaryTree wrapper.

import java.util.ArrayList;
import java.util.List;

class Node {
    int key;
    Node left;
    Node right;

    public Node(int key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class BinaryTree {
    Node root;

    public BinaryTree() {
        this.root = null;
    }

    public void insert(int key) {
        this.root = insertRec(this.root, key);
    }

    private Node insertRec(Node node, int key) {
        if (node == null) {
            return new Node(key);
        }
        if (key < node.key) {
            node.left = insertRec(node.left, key);
        } else {
            node.right = insertRec(node.right, key);
        }
        return node;
    }

    public List<Integer> preorder() {
        List<Integer> result = new ArrayList<>();
        preorderRec(this.root, result);
        return result;
    }

    private void preorderRec(Node node, List<Integer> result) {
        if (node == null) {
            return;
        }
        result.add(node.key);
        preorderRec(node.left, result);
        preorderRec(node.right, result);
    }

    public static void main(String[] args) {
        BinaryTree tree = new BinaryTree();
        for (int k : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            tree.insert(k);
        }
        System.out.println("Pre-order: " + tree.preorder());
    }
}
