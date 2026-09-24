// Binary Tree Traversal - DISGUISE: renamed + reordered combo
// Derived from unique_recursive_1.py (the RECURSIVE family source).
// 1) renaming: Node->TreeNode, value->data, insert->addNode,
//    inorderRecursive->traverseInorder, buildTree->constructTree
// 2) reordering: traverseInorder defined before addNode.

import java.util.ArrayList;
import java.util.List;

class TreeNode {
    int data;
    TreeNode left;
    TreeNode right;

    public TreeNode(int data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Solution {
    public static void traverseInorder(TreeNode node, List<Integer> output) {
        if (node == null) {
            return;
        }
        traverseInorder(node.left, output);
        output.add(node.data);
        traverseInorder(node.right, output);
    }

    public static TreeNode addNode(TreeNode root, int data) {
        if (root == null) {
            return new TreeNode(data);
        }
        if (data < root.data) {
            root.left = addNode(root.left, data);
        } else {
            root.right = addNode(root.right, data);
        }
        return root;
    }

    public static TreeNode constructTree(int[] values) {
        TreeNode root = null;
        for (int v : values) {
            root = addNode(root, v);
        }
        return root;
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        TreeNode root = constructTree(values);
        List<Integer> output = new ArrayList<>();
        traverseInorder(root, output);
        System.out.println("In-order traversal (recursive): " + output);
    }
}
