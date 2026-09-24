class TreeNode {
    int value;
    TreeNode left, right;

    TreeNode(int value) {
        this.value = value;
        left = right = null;
    }
}

class BST {
    TreeNode root;

    public TreeNode add(TreeNode node, int value) {
        if (node == null) {
            return new TreeNode(value);
        }

        if (value < node.value) {
            node.left = add(node.left, value);
        } else {
            node.right = add(node.right, value);
        }

        return node;
    }

    public TreeNode find(TreeNode node, int value) {
        if (node == null || node.value == value) {
            return node;
        }

        if (value < node.value) {
            return find(node.left, value);
        }

        return find(node.right, value);
    }
}