class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left_child = None
        self.right_child = None


class BST:
    def __init__(self):
        self.main_root = None

    def add_node(self, current_node, new_value):
        if current_node is None:
            return TreeNode(new_value)

        if new_value < current_node.value:
            current_node.left_child = self.add_node(current_node.left_child, new_value)
        else:
            current_node.right_child = self.add_node(current_node.right_child, new_value)

        return current_node

    def find_node(self, current_node, target_value):
        if current_node is None or current_node.value == target_value:
            return current_node

        if target_value < current_node.value:
            return self.find_node(current_node.left_child, target_value)

        return self.find_node(current_node.right_child, target_value)


if __name__ == "__main__":
    tree = BST()
    numbers = [50, 30, 70, 20, 40, 60, 80]

    for num in numbers:
        tree.main_root = tree.add_node(tree.main_root, num)

    search_result = tree.find_node(tree.main_root, 60)
    print("Found" if search_result else "Not Found")