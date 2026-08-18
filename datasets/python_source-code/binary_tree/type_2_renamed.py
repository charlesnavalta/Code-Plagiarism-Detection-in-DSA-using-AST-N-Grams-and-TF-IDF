class TreeElement:
    def __init__(self, data):
        self.data = data
        self.left_child = None
        self.right_child = None


def inorder_walk(current_node):
    if current_node is None:
        return []

    output = []
    output.extend(inorder_walk(current_node.left_child))
    output.append(current_node.data)
    output.extend(inorder_walk(current_node.right_child))

    return output


if __name__ == "__main__":
    main_root = TreeElement(1)
    main_root.left_child = TreeElement(2)
    main_root.right_child = TreeElement(3)
    main_root.left_child.left_child = TreeElement(4)
    main_root.left_child.right_child = TreeElement(5)

    print(inorder_walk(main_root))