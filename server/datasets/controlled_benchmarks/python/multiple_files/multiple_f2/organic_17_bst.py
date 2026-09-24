# Organic BST Student Submission 17
def make_bst_node(key):
    return {"key": key, "left": None, "right": None}

def bst_insert_dict(tree, key):
    if tree is None:
        return make_bst_node(key)
    if key < tree["key"]:
        tree["left"] = bst_insert_dict(tree["left"], key)
    elif key > tree["key"]:
        tree["right"] = bst_insert_dict(tree["right"], key)
    return tree

def bst_search_dict(tree, key):
    curr = tree
    while curr:
        if curr["key"] == key: return True
        curr = curr["left"] if key < curr["key"] else curr["right"]
    return False

def bst_inorder_dict(tree):
    if not tree: return []
    return bst_inorder_dict(tree["left"]) + [tree["key"]] + bst_inorder_dict(tree["right"])
