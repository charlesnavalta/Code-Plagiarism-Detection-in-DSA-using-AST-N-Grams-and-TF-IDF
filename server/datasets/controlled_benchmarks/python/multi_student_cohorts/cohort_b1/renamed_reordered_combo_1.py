# Binary Tree Traversal - DISGUISE: renamed + reordered combo
# Derived from unique_recursive_1.py (the RECURSIVE family source).
# Combines two disguise techniques at once:
#   1) renaming: Node->TreeNode, value->data, insert->add_node,
#      inorder_recursive->traverse_inorder, build_tree->construct_tree,
#      result->output
#   2) reordering: traverse_inorder is now defined BEFORE add_node
#      (original order was insert then inorder_recursive)
# The algorithm and output are identical to unique_recursive_1.py, and
# this should be correctly attributed back to it - and NOT to the
# iterative family.

class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


def traverse_inorder(node, output):
    if node is None:
        return
    traverse_inorder(node.left, output)
    output.append(node.data)
    traverse_inorder(node.right, output)


def add_node(root, data):
    if root is None:
        return TreeNode(data)
    if data < root.data:
        root.left = add_node(root.left, data)
    else:
        root.right = add_node(root.right, data)
    return root


def construct_tree(values):
    root = None
    for v in values:
        root = add_node(root, v)
    return root


if __name__ == "__main__":
    values = [50, 30, 70, 20, 40, 60, 80]
    root = construct_tree(values)
    output = []
    traverse_inorder(root, output)
    print("In-order traversal (recursive):", output)
