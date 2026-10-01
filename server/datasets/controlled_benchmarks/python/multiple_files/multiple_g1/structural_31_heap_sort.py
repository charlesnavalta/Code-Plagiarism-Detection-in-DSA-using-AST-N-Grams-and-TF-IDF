def exchange_val(seq, p1, p2):
    t_val = seq[p1]
    seq[p1] = seq[p2]
    seq[p2] = t_val

def sift_tree(seq, limit, root_idx):
    lead_idx = root_idx
    left_node = 2 * root_idx + 1
    right_node = 2 * root_idx + 2
    if left_node < limit and seq[left_node] > seq[lead_idx]:
        lead_idx = left_node
    if right_node < limit and seq[right_node] > seq[lead_idx]:
        lead_idx = right_node
    if lead_idx != root_idx:
        exchange_val(seq, root_idx, lead_idx)
        sift_tree(seq, limit, lead_idx)

def heap_sort(seq):
    sz = len(seq)
    for step in range(sz // 2 - 1, -1, -1):
        sift_tree(seq, sz, step)
    step = sz - 1
    while step > 0:
        exchange_val(seq, 0, step)
        sift_tree(seq, step, 0)
        step -= 1
    return seq
