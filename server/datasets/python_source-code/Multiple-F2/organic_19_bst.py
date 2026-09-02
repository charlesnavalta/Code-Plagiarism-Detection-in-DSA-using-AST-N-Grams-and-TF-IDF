# Organic BST Student Submission 19
def persistent_insert(node, val):
    if node is None:
        return (val, None, None)
    v, left, right = node
    if val < v:
        return (v, persistent_insert(left, val), right)
    elif val > v:
        return (v, left, persistent_insert(right, val))
    return node

def persistent_search(node, val):
    while node:
        v, left, right = node
        if v == val: return True
        node = left if val < v else right
    return False

def persistent_inorder(node):
    if not node: return []
    v, left, right = node
    return persistent_inorder(left) + [v] + persistent_inorder(right)
