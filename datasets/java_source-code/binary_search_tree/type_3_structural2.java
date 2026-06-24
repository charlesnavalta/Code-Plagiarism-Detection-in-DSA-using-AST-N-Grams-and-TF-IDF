class Node {
    int key;
    Node left, right;

    public Node(int val) {
        this.key = val;
        left = right = null;
    }
}

class BinarySearchTree {
    Node root;

    public BinarySearchTree() {
        root = null;
    }

    // Recursive insertion (matches Python insert)
    public Node insert(Node root, int key) {
        if (root == null) {
            return new Node(key);
        }

        if (key < root.key) {
            root.left = insert(root.left, key);
        } else {
            root.right = insert(root.right, key);
        }

        return root;
    }

    // Recursive search (returns Node like Python version)
    public Node search(Node node, int target) {
        if (node == null || node.key == target) {
            return node;
        }

        if (target < node.key) {
            return search(node.left, target);
        } else {
            return search(node.right, target);
        }
    }

    // In-order traversal (Left - Root - Right)
    public void inorderPrint(Node node) {
        if (node != null) {
            inorderPrint(node.left);
            System.out.print(node.key + " ");
            inorderPrint(node.right);
        }
    }

    // Find minimum value (leftmost node)
    public Integer getMinValue(Node node) {
        if (node == null) {
            return null;
        }

        while (node.left != null) {
            node = node.left;
        }

        return node.key;
    }
}

public class type_3_structural2 {
    public static void main(String[] args) {
        BinarySearchTree myTree = new BinarySearchTree();

        int[] dataset = {50, 30, 70, 20, 40, 60, 80};

        // Data insertion
        for (int item : dataset) {
            myTree.root = myTree.insert(myTree.root, item);
        }

        // Search 60
        Node foundNode = myTree.search(myTree.root, 60);
        System.out.println(foundNode != null ? "Found: 60" : "Not Found: 60");

        // Search 99
        Node missingNode = myTree.search(myTree.root, 99);
        System.out.println(missingNode != null ? "Found: 99" : "Not Found: 99");

        // In-order traversal
        System.out.println("\nIn-Order Traversal Output:");
        myTree.inorderPrint(myTree.root);

        // Minimum value
        System.out.println("\n\nSmallest Value Found: " + myTree.getMinValue(myTree.root));
    }
}