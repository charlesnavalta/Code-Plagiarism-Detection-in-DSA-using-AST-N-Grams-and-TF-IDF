def create_tree_node_15(key_value):
    return {'k': key_value, 'left_child': None, 'right_child': None}

def put_tree_item_15(tree_dict, key_value):
    if not tree_dict: return create_tree_node_15(key_value)
    if key_value < tree_dict['k']:
        tree_dict['left_child'] = put_tree_item_15(tree_dict['left_child'], key_value)
    else:
        tree_dict['right_child'] = put_tree_item_15(tree_dict['right_child'], key_value)
    return tree_dict

def has_tree_item_15(tree_dict, key_value):
    if not tree_dict: return False
    if tree_dict['k'] == key_value: return True
    return has_tree_item_15(tree_dict['left_child'], key_value) if key_value < tree_dict['k'] else has_tree_item_15(tree_dict['right_child'], key_value)

def dump_sorted_tree_15(tree_dict):
    if not tree_dict: return []
    return dump_sorted_tree_15(tree_dict['left_child']) + [tree_dict['k']] + dump_sorted_tree_15(tree_dict['right_child'])
