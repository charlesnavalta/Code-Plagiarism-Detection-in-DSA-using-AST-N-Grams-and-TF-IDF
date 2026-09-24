class Item:
    def __init__(self, data):
        self.data = data
        self.left_node = None
        self.right_node = None


class SearchTree:
    def __init__(self):
        self.start = None

    def insert_value(self, node_ref, data):
        if node_ref is None:
            return Item(data)

        if data < node_ref.data:
            node_ref.left_node = self.insert_value(node_ref.left_node, data)
        else:
            node_ref.right_node = self.insert_value(node_ref.right_node, data)

        return node_ref

    def locate(self, node_ref, target):
        if node_ref is None or node_ref.data == target:
            return node_ref

        if target < node_ref.data:
            return self.locate(node_ref.left_node, target)

        return self.locate(node_ref.right_node, target)


if __name__ == "__main__":
    structure = SearchTree()
    elements = [50, 30, 70, 20, 40, 60, 80]

    for e in elements:
        structure.start = structure.insert_value(structure.start, e)

    output = structure.locate(structure.start, 60)
    print("Found" if output else "Not Found")